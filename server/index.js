import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import admin from 'firebase-admin';

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
// শুধু এই জিমেইলগুলো অ্যাডমিন প্যানেলে ঢুকতে পারবে (.env এর ADMIN_EMAILS থেকে আসে)
const ADMINS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

await mongoose.connect(process.env.MONGODB_URI);
const Donor = mongoose.model('Donor', new mongoose.Schema({
  name: String, phone: String, bloodGroup: String, area: String, lastDonation: String,
  approved: { type: Boolean, default: false } }, { timestamps: true }));
const Post = mongoose.model('Post', new mongoose.Schema({ title: String, body: String }, { timestamps: true }));

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

const guard = async (req, res, next) => {
  try {
    const u = await admin.auth().verifyIdToken((req.headers.authorization || '').replace('Bearer ', ''));
    if (!ADMINS.includes((u.email || '').toLowerCase())) return res.status(403).json({ error: 'অনুমতি নেই' });
    next();
  } catch { res.status(401).json({ error: 'লগইন করুন' }); }
};

app.get('/', (_, r) => r.send('OK'));
app.get('/api/donors', async (_, r) => r.json(await Donor.find({ approved: true }).sort('-createdAt')));
app.post('/api/donors', async (q, r) => {
  const { name, phone, bloodGroup, area, lastDonation } = q.body;
  if (!name || !phone || !bloodGroup) return r.status(400).json({ error: 'তথ্য অসম্পূর্ণ' });
  r.json(await Donor.create({ name, phone, bloodGroup, area, lastDonation, approved: false }));
});
app.get('/api/posts', async (_, r) => r.json(await Post.find().sort('-createdAt')));

app.get('/api/admin/donors', guard, async (_, r) => r.json(await Donor.find().sort('-createdAt')));
for (const [path, M] of [['donors', Donor], ['posts', Post]]) {
  app.post(`/api/admin/${path}`, guard, async (q, r) => r.json(await M.create(q.body)));
  app.put(`/api/admin/${path}/:id`, guard, async (q, r) => r.json(await M.findByIdAndUpdate(q.params.id, q.body, { new: true })));
  app.delete(`/api/admin/${path}/:id`, guard, async (q, r) => r.json(await M.findByIdAndDelete(q.params.id)));
}
app.listen(process.env.PORT || 5000, () => console.log('Server running'));
