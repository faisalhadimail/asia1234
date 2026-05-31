import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyB22tfg_7BGtNtPCQ6R8pS2tKoQb4JxxNs",
  authDomain: "kprasia-f50c2.firebaseapp.com",
  projectId: "kprasia-f50c2",
  storageBucket: "kprasia-f50c2.firebasestorage.app",
  messagingSenderId: "28449741969",
  appId: "1:28449741969:web:f54bd399840da763467330",
  measurementId: "G-EEHLGVMP57"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Analytics (client only)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export { app, analytics }
export default app