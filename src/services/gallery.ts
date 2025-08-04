
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export interface GalleryImage {
  id?: string;
  src: string;
  alt: string;
  aiHint: string;
}

const galleryCollection = collection(db, 'gallery');

export const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
  return await addDoc(galleryCollection, image);
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const snapshot = await getDocs(galleryCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
};

export const onGalleryImagesUpdate = (callback: (images: GalleryImage[]) => void) => {
  return onSnapshot(galleryCollection, snapshot => {
    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
    callback(images);
  });
};

export const deleteGalleryImage = async (id: string) => {
    const imageDoc = doc(db, 'gallery', id);
    return await deleteDoc(imageDoc);
};
