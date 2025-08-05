
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface Notification {
  id?: string;
  // userId: string; // To target specific users in a real app
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt?: any;
}

const notificationsCollection = collection(db, 'notifications');

export const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
  return await addDoc(notificationsCollection, {
    ...notification,
    createdAt: serverTimestamp()
  });
};

export const onNotificationsUpdate = (callback: (notifications: Notification[]) => void) => {
  const q = query(notificationsCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    callback(notifications);
  });
};

export const updateNotificationReadStatus = async (id: string, read: boolean) => {
    const notificationDoc = doc(db, 'notifications', id);
    return await updateDoc(notificationDoc, { read });
};
