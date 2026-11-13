import { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { api } from './api';

export default function Admin() {
  const [u, setU] = useState(null), [tok, setTok] = useState(''), [donors, setD] = useState([]), [posts, setP] = useState([]), [err, setE] = useState(''), [np, setNp] = useState({ title: '', body: '' });
  useEffect(() => onAuthStateChanged(auth, async x => { setU(x); setTok(x ? await x.getIdToken() : ''); }), []);
  const load = () => {
    setE('');
    api('/admin/donors', {}, tok).then(setD).catch(() => setE('❌ এই জিমেইলের অ্যাডমিন অনুমতি নেই'));
    api('/posts').then(setP);
  };
  useEffect(() => { if (tok) load(); }, [tok]);
  const act = async (path, method, body) => { await api(path, { method, body: body && JSON.stringify(body) }, tok); load(); };
  const btn = 'rounded-lg px-3 py-1 text-sm font-semibold text-white';

  if (!u) return (
    <div className="flex min-h-screen items-center justify-center bg-red-950">
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-800 shadow-xl">Google দিয়ে অ্যাডমিন লগইন</button>
    </div>);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between"><h1 className="text-2xl font-bold text-red-900">অ্যাডমিন প্যানেল</h1>
        <button onClick={() => signOut(auth)} className={btn + ' bg-gray-700'}>লগআউট ({u.email})</button></div>
      {err && <p className="mb-4 rounded-xl bg-red-100 p-4 font-semibold text-red-800">{err}</p>}

      <h2 className="mt-6 text-xl font-bold">রক্তদাতা ({donors.length})</h2>
      {donors.map(d => (
        <div key={d._id} className="my-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 shadow">
          <div><b>{d.name}</b> — {d.bloodGroup} — {d.phone} — {d.area} {d.approved ? '✅' : '⏳'}</div>
          <div className="flex gap-2">
            <button className={btn + ' bg-green-600'} onClick={() => act('/admin/donors/' + d._id, 'PUT', { approved: !d.approved })}>{d.approved ? 'বাতিল' : 'অনুমোদন'}</button>
            <button className={btn + ' bg-blue-600'} onClick={() => { const name = prompt('নতুন নাম', d.name); if (name) act('/admin/donors/' + d._id, 'PUT', { name }); }}>এডিট</button>
            <button className={btn + ' bg-red-700'} onClick={() => confirm('ডিলিট করবেন?') && act('/admin/donors/' + d._id, 'DELETE')}>ডিলিট</button>
          </div>
        </div>))}

      <h2 className="mt-8 text-xl font-bold">নতুন পোস্ট</h2>
      <input value={np.title} onChange={e => setNp({ ...np, title: e.target.value })} placeholder="শিরোনাম" className="my-2 w-full rounded-xl border p-3" />
      <textarea value={np.body} onChange={e => setNp({ ...np, body: e.target.value })} placeholder="বিস্তারিত" className="w-full rounded-xl border p-3" rows="3" />
      <button className={btn + ' bg-red-700 !px-6 !py-2'} onClick={async () => { await act('/admin/posts', 'POST', np); setNp({ title: '', body: '' }); }}>পোস্ট করুন</button>
      {posts.map(p => (
        <div key={p._id} className="my-2 flex items-center justify-between rounded-xl bg-white p-3 shadow"><b>{p.title}</b>
          <div className="flex gap-2">
            <button className={btn + ' bg-blue-600'} onClick={() => { const title = prompt('নতুন শিরোনাম', p.title); if (title) act('/admin/posts/' + p._id, 'PUT', { title }); }}>এডিট</button>
            <button className={btn + ' bg-red-700'} onClick={() => confirm('ডিলিট করবেন?') && act('/admin/posts/' + p._id, 'DELETE')}>ডিলিট</button>
          </div></div>))}
    </div>
  );
}
