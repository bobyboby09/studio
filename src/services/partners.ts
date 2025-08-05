
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, query, where, serverTimestamp, orderBy, getDoc, increment } from 'firebase/firestore';

export interface Partner {
  id?: string;
  whatsappNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: any;
  earnings?: number;
  message?: string;
}

const partnersCollection = collection(db, 'partners');

export const requestPartnerAccess = async (whatsappNumber: string) => {
  // Check if a request with this number already exists
  const q = query(partnersCollection, where("whatsappNumber", "==", whatsappNumber));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error("A partner request with this number already exists.");
  }

  const newPartnerRequest = {
    whatsappNumber,
    status: 'Pending',
    createdAt: serverTimestamp(),
    earnings: 0,
  };
  return await addDoc(partnersCollection, newPartnerRequest);
};

export const getPartnerByWhatsappNumber = async (whatsappNumber: string): Promise<Partner | null> => {
    const q = query(partnersCollection, where("whatsappNumber", "==", whatsappNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    
    const partnerDoc = querySnapshot.docs[0];
    return { id: partnerDoc.id, ...partnerDoc.data() } as Partner;
};

export const getPartnerById = async (id: string): Promise<Partner | null> => {
    const partnerDocRef = doc(db, 'partners', id);
    const partnerDoc = await getDoc(partnerDocRef);
    if (partnerDoc.exists()) {
        return { id: partnerDoc.id, ...partnerDoc.data() } as Partner;
    }
    return null;
}


export const onPartnersUpdate = (callback: (partners: Partner[]) => void) => {
  const q = query(partnersCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const partners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Partner));
    callback(partners);
  });
};

export const onPartnerUpdate = (id: string, callback: (partner: Partner | null) => void) => {
    const partnerDocRef = doc(db, 'partners', id);
    return onSnapshot(partnerDocRef, (doc) => {
        if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() } as Partner);
        } else {
            callback(null);
        }
    });
};

export const updatePartner = async (id: string, data: Partial<Partner>) => {
  const partnerDoc = doc(db, 'partners', id);
  return await updateDoc(partnerDoc, data);
};

export const updatePartnerEarnings = async (id: string, earning: number) => {
    const partnerDoc = doc(db, 'partners', id);
    return await updateDoc(partnerDoc, {
        earnings: increment(earning)
    });
};
