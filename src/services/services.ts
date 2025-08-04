
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  aiHint: string;
}

const servicesCollection = collection(db, 'services');

export const addService = async (service: Omit<Service, 'id'>) => {
  return await addDoc(servicesCollection, service);
};

export const getServices = async (): Promise<Service[]> => {
  const snapshot = await getDocs(servicesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
};

export const onServicesUpdate = (callback: (services: Service[]) => void) => {
  return onSnapshot(servicesCollection, snapshot => {
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    callback(services);
  });
};

export const updateService = async (id: string, service: Partial<Service>) => {
    const serviceDoc = doc(db, 'services', id);
    return await updateDoc(serviceDoc, service);
};

export const deleteService = async (id: string) => {
    const serviceDoc = doc(db, 'services', id);
    return await deleteDoc(serviceDoc);
};
