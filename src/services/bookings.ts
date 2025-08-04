import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Booking {
  id?: string;
  service: string;
  date: Date;
  name: string;
  phone: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

const bookingsCollection = collection(db, 'bookings');

export const addBooking = async (booking: Omit<Booking, 'id' | 'status'>) => {
  const newBooking: Omit<Booking, 'id'> = {
    ...booking,
    status: 'Pending',
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

export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  const bookingDoc = doc(db, 'bookings', id);
  return await updateDoc(bookingDoc, { status });
};

export const deleteBooking = async (id: string) => {
  const bookingDoc = doc(db, 'bookings', id);
  return await deleteDoc(bookingDoc);
};
