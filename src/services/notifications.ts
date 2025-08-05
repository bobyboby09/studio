
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';

export interface Notification {
  id?: string;
  userId: string; // In a real app, you'd use the actual user ID
  bookingId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationsCollection = collection(db, 'notifications');

export const createNotification = async (notification: Omit<Notification, 'id'>) => {
  return await addDoc(notificationsCollection, notification);
};

export const onNotificationsUpdate = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    notificationsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, snapshot => {
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    callback(notifications);
  });
};

export const markNotificationAsRead = async (id: string) => {
  const notificationDoc = doc(db, 'notifications', id);
  return await updateDoc(notificationDoc, { isRead: true });
};
