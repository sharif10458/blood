import { useEffect, useState } from 'react';
import { SITE } from './config';

export default function InstallApp() {
  const [ev, setEv] = useState(null);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
  );
  useEffect(() => {
    const on = e => { e.preventDefault(); setEv(e); };
    const done = () => { setInstalled(true); setEv(null); };
    window.addEventListener('beforeinstallprompt', on);
    window.addEventListener('appinstalled', done);
    return () => {
      window.removeEventListener('beforeinstallprompt', on);
      window.removeEventListener('appinstalled', done);
    };
  }, []);
  if (installed) return null;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const install = async () => {
    if (ev) { ev.prompt(); await ev.userChoice; setEv(null); }
    else setHelp(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-900 to-rose-700 px-4 py-2 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-xl bg-white/20" onError={e => (e.target.style.display = 'none')} />
            <div className="leading-tight">
              <div className="font-bold">{SITE.name} অ্যাপ</div>
              <div className="text-xs text-red-100">ফ্রি ইনস্টল করুন, মোবাইলে অ্যাপের মতো চালান</div>
            </div>
          </div>
          <button onClick={install} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-red-800 shadow transition hover:scale-105">📲 অ্যাপ ডাউনলোড করুন</button>
        </div>
      </div>

      <button onClick={install} className="beat fixed bottom-5 right-5 z-30 rounded-full bg-red-700 px-5 py-3 font-bold text-white shadow-2xl">📲 অ্যাপ</button>

      {help && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onClick={() => setHelp(false)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-red-950" onClick={e => e.stopPropagation()}>
            <h3 className="fancy mb-3 text-2xl font-bold text-red-900">অ্যাপ ইনস্টল করুন</h3>
            {isIOS ? (
              <ol className="list-decimal space-y-2 pl-5">
                <li>Safari ব্রাউজারে সাইটটি খুলুন</li>
                <li>নিচের <b>Share (⬆️)</b> বাটন চাপুন</li>
                <li><b>Add to Home Screen</b> বাছুন</li>
                <li><b>Add</b> চাপুন</li>
              </ol>
            ) : (
              <ol className="list-decimal space-y-2 pl-5">
                <li>Chrome ব্রাউজারে সাইটটি খুলুন</li>
                <li>উপরের ডান দিকের <b>⋮ (তিন ডট)</b> চাপুন</li>
                <li><b>Install app</b> অথবা <b>Add to Home screen</b> বাছুন</li>
                <li><b>Install</b> চাপুন</li>
              </ol>
            )}
            <button onClick={() => setHelp(false)} className="mt-5 w-full rounded-xl bg-red-700 py-3 font-bold text-white">ঠিক আছে</button>
          </div>
        </div>
      )}
    </>
  );
}