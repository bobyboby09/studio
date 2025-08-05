
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { getServiceByName } from './services';
import { getPromoByCode } from './promos';
import { addNotification } from './notifications';

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

export const updateBooking = async (id: string, data: Partial<Booking>) => {
    const bookingDoc = doc(db, 'bookings', id);
    return await updateDoc(bookingDoc, data);
};


export const updateBookingStatus = async (id: string, status: Booking['status']) => {
  const bookingDoc = doc(db, 'bookings', id);
  const updateData: Partial<Booking> = { status };
  await updateDoc(bookingDoc, updateData);

  if (status === 'Confirmed') {
      await addNotification({
          // In a real app, you'd target a specific userId. 
          // For now, it's a general notification.
          title: "आपकी बुकिंग कन्फर्म हो गई है!",
          message: `आपकी बुकिंग की पुष्टि हो गई है। कृपया अंतिम पुष्टि के लिए विवरण जांचें।`,
          link: `/booking-confirmation/${id}`,
          read: false,
      });
  }
};

export const deleteBooking = async (id: string) => {
  const bookingDoc = doc(db, 'bookings', id);
  return await deleteDoc(bookingDoc);
};


export const calculateFinalPrice = async (booking: Booking): Promise<number | null> => {
    try {
        const service = await getServiceByName(booking.service);
        if (!service || !service.price) return null;

        let currentPrice = parseFloat(service.price.replace(/[^0-9.-]+/g,""));
        if (isNaN(currentPrice)) return null;

        if (booking.promoCode) {
            const promo = await getPromoByCode(booking.promoCode);
            if (promo && promo.discount) {
                const discount = promo.discount;
                if (discount.includes('%')) {
                    const percentage = parseFloat(discount.replace('%', ''));
                    currentPrice -= (currentPrice * (percentage / 100));
                } else {
                    const amount = parseFloat(discount.replace(/[^0-9.-]+/g,""));
                    if(!isNaN(amount)) {
                        currentPrice -= amount;
                    }
                }
            }
        }
        return currentPrice;
    } catch (error) {
        console.error("Error calculating final price:", error);
        return null;
    }
};
