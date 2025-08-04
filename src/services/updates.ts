
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export interface Update {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: any;
}

const updatesCollection = collection(db, 'updates');

export const addUpdate = async (update: Omit<Update, 'id' | 'createdAt'>) => {
  return await addDoc(updatesCollection, {
      ...update,
      createdAt: serverTimestamp()
  });
};

export const onUpdatesUpdate = (callback: (updates: Update[]) => void) => {
  const q = query(updatesCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const updates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Update));
    callback(updates);
  });
};

export const deleteUpdate = async (id: string) => {
    const updateDocRef = doc(db, 'updates', id);
    return await deleteDoc(updateDocRef);
};

export const updateUpdate = async (id: string, update: Partial<Update>) => {
    const updateDocRef = doc(db, 'updates', id);
    return await updateDoc(updateDocRef, update);
};
