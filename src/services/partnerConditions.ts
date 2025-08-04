
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export interface PartnerCondition {
  id?: string;
  text: string;
}

const partnerConditionsCollection = collection(db, 'partnerConditions');

export const addPartnerCondition = async (condition: Omit<PartnerCondition, 'id'>) => {
  return await addDoc(partnerConditionsCollection, condition);
};

export const onPartnerConditionsUpdate = (callback: (conditions: PartnerCondition[]) => void) => {
  const q = query(partnerConditionsCollection);
  return onSnapshot(q, snapshot => {
    const conditions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerCondition));
    callback(conditions);
  });
};

export const updatePartnerCondition = async (id: string, condition: Partial<PartnerCondition>) => {
    const conditionDoc = doc(db, 'partnerConditions', id);
    return await updateDoc(conditionDoc, condition);
};

export const deletePartnerCondition = async (id: string) => {
    const conditionDoc = doc(db, 'partnerConditions', id);
    return await deleteDoc(conditionDoc);
};

    