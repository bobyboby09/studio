import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export interface PromoCode {
  id?: string;
  code: string;
  discount: string;
}

const promoCodesCollection = collection(db, 'promoCodes');

export const addPromoCode = async (promoCode: Omit<PromoCode, 'id'>) => {
  return await addDoc(promoCodesCollection, promoCode);
};

export const onPromoCodesUpdate = (callback: (promoCodes: PromoCode[]) => void) => {
  return onSnapshot(promoCodesCollection, snapshot => {
    const promoCodes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
    callback(promoCodes);
  });
};

export const deletePromoCode = async (id: string) => {
    const promoCodeDoc = doc(db, 'promoCodes', id);
    return await deleteDoc(promoCodeDoc);
};
