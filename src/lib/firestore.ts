import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { initializeApp, getApps, getApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyB22tfg_7BGtNtPCQ6R8pS2tKoQb4JxxNs",
  authDomain: "kprasia-f50c2.firebaseapp.com",
  projectId: "kprasia-f50c2",
  storageBucket: "kprasia-f50c2.firebasestorage.app",
  messagingSenderId: "28449741969",
  appId: "1:28449741969:web:f54bd399840da763467330",
  measurementId: "G-EEHLGVMP57"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)

// Helper functions for Firestore operations
export const dbFirebase = db

export const getCollection = async (collectionName: string) => {
  const q = query(collection(db, collectionName))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export const createDocument = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), data)
  return { id: docRef.id, ...data }
}

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, data)
  return { id, ...data }
}

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
  return { success: true }
}

export const queryCollection = async (
  collectionName: string,
  constraints: any[] = []
) => {
  const q = query(collection(db, collectionName), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export default db