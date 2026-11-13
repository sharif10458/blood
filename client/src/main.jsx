import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './index.css';
import App from './App';
const Admin = lazy(() => import('./Admin'));
createRoot(document.getElementById('root')).render(
  location.pathname.startsWith('/admin') ? <Suspense fallback={null}><Admin /></Suspense> : <App />
);
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));