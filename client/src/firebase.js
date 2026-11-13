import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const e = import.meta.env;
export const auth = getAuth(initializeApp({
  apiKey: e.VITE_FIREBASE_API_KEY, authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: e.VITE_FIREBASE_PROJECT_ID, appId: e.VITE_FIREBASE_APP_ID }));
