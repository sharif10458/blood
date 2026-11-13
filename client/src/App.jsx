import { useEffect, useState } from 'react';
import { api } from './api';
import { SITE } from './config';
import InstallApp from './InstallApp';
const G = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const nav = [['home', 'হোম'], ['donors', 'ডোনার'], ['apply', 'ডোনার হোন'], ['posts', 'খবর']];

export default function App() {
  const [donors, setD] = useState([]), [posts, setP] = useState([]), [f, setF] = useState(''), [msg, setM] = useState(''), [form, setForm] = useState({ bloodGroup: 'A+' }), [open, setOpen] = useState(false);
  useEffect(() => { api('/donors').then(setD).catch(() => {}); api('/posts').then(setP).catch(() => {}); }, []);
  const set = k => e => setForm({ ...form, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    try { await api('/donors', { method: 'POST', body: JSON.stringify(form) }); setM('✅ আবেদন জমা হয়েছে! অনুমোদনের পর তালিকায় আসবে।'); e.target.reset(); }
    catch { setM('❌ আবার চেষ্টা করুন'); }
  };
  const list = donors.filter(d => !f || d.bloodGroup === f);
  const inp = 'w-full rounded-xl border border-red-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-red-600';
  return (
    <div>
       <InstallApp />
      <header className="sticky top-0 z-20 bg-red-950/95 text-white backdrop-blur shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="fancy flex items-center gap-2 text-xl font-bold"><img src={SITE.logo} alt="" className="h-8 w-8 rounded-full" onError={e => (e.target.style.display = 'none')} />{SITE.name}</a>
          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>☰</button>
          <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full w-full flex-col bg-red-950 p-4 md:static md:flex md:w-auto md:flex-row md:gap-6 md:bg-transparent md:p-0`}>
            {nav.map(([id, t]) => <a key={id} href={'#' + id} onClick={() => setOpen(false)} className="py-2 hover:text-red-300">{t}</a>)}
          </nav>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-800 to-rose-600 px-4 py-20 text-center text-white">
        <img src={SITE.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" onError={e => (e.target.style.display = 'none')} />
        <div className="fl absolute left-6 top-10 text-6xl opacity-30">🩸</div>
        <div className="fl absolute bottom-10 right-8 text-7xl opacity-20" style={{ animationDelay: '1s' }}>🩸</div>
        <div className="up mx-auto max-w-3xl">
          <div className="beat text-7xl">❤️</div>
          <h1 className="fancy mt-4 text-4xl font-bold md:text-6xl">আপনার এক ব্যাগ রক্ত,<br />বাঁচাতে পারে একটি প্রাণ</h1>
          <p className="mt-5 text-lg text-red-100">টঙ্গীর রক্তদাতাদের নিয়ে গড়া একটি পরিবার। রক্ত দিন, জীবন বাঁচান।</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#apply" className="rounded-full bg-white px-8 py-3 font-bold text-red-800 shadow-xl hover:scale-105 transition">রক্তদাতা হোন</a>
            <a href="#donors" className="rounded-full border-2 border-white px-8 py-3 font-bold hover:bg-white/10 transition">রক্ত খুঁজুন</a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-3">
            {[[donors.length + '+', 'রক্তদাতা'], ['৮', 'রক্তের গ্রুপ'], ['২৪/৭', 'সেবা']].map(([n, t]) => (
              <div key={t} className="rounded-2xl bg-white/10 p-4 backdrop-blur"><div className="text-3xl font-bold">{n}</div><div className="text-sm text-red-100">{t}</div></div>))}
          </div>
        </div>
      </section>

      <section id="donors" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="fancy text-center text-3xl font-bold text-red-900">আমাদের রক্তদাতারা</h2>
        <div className="my-6 flex flex-wrap justify-center gap-2">
          {['', ...G].map(g => <button key={g} onClick={() => setF(g)} className={`rounded-full px-4 py-1.5 font-semibold ${f === g ? 'bg-red-700 text-white' : 'bg-white text-red-800 border border-red-200'}`}>{g || 'সব'}</button>)}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(d => (
            <div key={d._id} className="up rounded-3xl bg-white p-6 shadow-lg ring-1 ring-red-100 hover:-translate-y-1 transition">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-rose-500 text-xl font-bold text-white">{d.bloodGroup}</div>
                <div><div className="text-lg font-bold">{d.name}</div><div className="text-sm text-red-700">📍 {d.area || 'টঙ্গী'}</div></div>
              </div>
              {d.lastDonation && <div className="mt-3 text-sm text-gray-600">সর্বশেষ রক্তদান: {d.lastDonation}</div>}
              <a href={'tel:' + d.phone} className="mt-4 block rounded-xl bg-red-700 py-2 text-center font-semibold text-white hover:bg-red-800">📞 কল করুন</a>
            </div>))}
        </div>
        {!list.length && <p className="text-center text-gray-500">কোনো রক্তদাতা পাওয়া যায়নি</p>}
      </section>

      <section id="apply" className="bg-red-50 px-4 py-16">
        <form onSubmit={submit} className="mx-auto max-w-lg space-y-4 rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="fancy text-center text-3xl font-bold text-red-900">রক্তদাতা হিসেবে আবেদন</h2>
          <input required placeholder="আপনার নাম" className={inp} onChange={set('name')} />
          <input required placeholder="মোবাইল নম্বর" className={inp} onChange={set('phone')} />
          <select className={inp} onChange={set('bloodGroup')}>{G.map(g => <option key={g}>{g}</option>)}</select>
          <input placeholder="এলাকা (যেমন: টঙ্গী স্টেশন রোড)" className={inp} onChange={set('area')} />
          <input type="date" className={inp} onChange={set('lastDonation')} />
          <button className="w-full rounded-xl bg-red-700 py-3 font-bold text-white hover:bg-red-800">আবেদন করুন</button>
          {msg && <p className="text-center font-semibold">{msg}</p>}
        </form>
      </section>

      <section id="posts" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="fancy text-center text-3xl font-bold text-red-900">খবর ও ঘোষণা</h2>
        <div className="mt-8 space-y-4">
          {posts.map(p => <article key={p._id} className="rounded-2xl bg-white p-6 shadow ring-1 ring-red-100"><h3 className="text-xl font-bold text-red-800">{p.title}</h3><p className="mt-2 whitespace-pre-line text-gray-700">{p.body}</p></article>)}
        </div>
      </section>

      <footer className="bg-red-950 px-4 py-8 text-center text-red-200">
        <div className="font-bold">{SITE.name}</div>
        <div className="mt-2">📞 <a href={'tel:' + SITE.phone}>{SITE.phone}</a> &nbsp; 📍 {SITE.address}</div>
        {SITE.facebook && <a href={SITE.facebook} className="mt-1 block underline">ফেসবুক পেজ</a>}
        <div className="mt-2 text-sm">রক্ত দিন, জীবন বাঁচান 🩸</div>
      </footer>
    </div>
  );
}
