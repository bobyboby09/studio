
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createNotification } from './notifications';

export interface Booking {
  id?: string;
  service: string;
  date: Date;
  name: string;
  phone: string;
  notes?: string;
  promoCode?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'User Confirmed';
  partnerId?: string; // To link booking to a partner
  partnerWhatsapp?: string; // To easily identify partner
  finalPrice?: number;
  userConfirmed?: boolean;
}

const bookingsCollection = collection(db, 'bookings');

export const addBooking = async (booking: Omit<Booking, 'id' | 'status'>) => {
  const newBooking: Omit<Booking, 'id'> = {
    ...booking,
    status: 'Pending',
    userConfirmed: false,
  };
  return await addDoc(bookingsCollection, newBooking);
};

export const getBookings = async () => {
  const snapshot = await getDocs(bookingsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
};

export const onBookingsUpdate = (callback: (bookings: Booking[]) => void) => {
  return onSnapshot(bookingsCollection, snapshot => {
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
    callback(bookings);
  });
};

export const updateBooking = async (id: string, data: Partial<Booking>) => {
    const bookingDoc = doc(db, 'bookings', id);
    return await updateDoc(bookingDoc, data);
};


export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  const bookingDoc = doc(db, 'bookings', id);
  const updateData: Partial<Booking> = { status };
  await updateDoc(bookingDoc, updateData);

  if (status === 'Confirmed') {
      await createNotification({
          userId: 'admin', // In a real multi-user app, this would be the user's ID
          bookingId: id,
          message: `आपकी बुकिंग की पुष्टि हो गई है! विवरण देखने और अंतिम पुष्टि करने के लिए क्लिक करें।`,
          isRead: false,
          createdAt: new Date(),
      });
  }
};

export const deleteBooking = async (id: string) => {
  const bookingDoc = doc(db, 'bookings', id);
  return await deleteDoc(bookingDoc);
};
