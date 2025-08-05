
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, where, limit } from 'firebase/firestore';

export interface User {
  id?: string;
  phone: string;
  name: string;
}

const usersCollection = collection(db, 'users');

// Add a new user
export const addUser = async (user: Omit<User, 'id'>) => {
  // Check if user already exists
  const existingUser = await getUser(user.phone);
  if (existingUser) {
    // Optionally update the name if it's different
    if (existingUser.name !== user.name) {
      await updateUser(existingUser.id!, { name: user.name });
    }
    return existingUser;
  }
  const docRef = await addDoc(usersCollection, user);
  return { id: docRef.id, ...user };
};

// Get a single user by phone number
export const getUser = async (phone: string): Promise<User | null> => {
  const q = query(usersCollection, where("phone", "==", phone), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  const userDoc = snapshot.docs[0];
  return { id: userDoc.id, ...userDoc.data() } as User;
};

// Get all users
export const onUsersUpdate = (callback: (users: User[]) => void) => {
  return onSnapshot(usersCollection, snapshot => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    callback(users);
  });
};

// Update a user's details
export const updateUser = async (id: string, data: Partial<User>) => {
  const userDoc = doc(db, 'users', id);
  return await updateDoc(userDoc, data);
};

// This function can be called when a booking is created to ensure the user exists
export const findOrCreateUser = async (phone: string, name: string): Promise<User> => {
    const existingUser = await getUser(phone);
    if(existingUser) {
        // Optional: update name if it's different in a new booking
        if(existingUser.name !== name){
            await updateUser(existingUser.id!, { name });
            return { ...existingUser, name };
        }
        return existingUser;
    }
    // Create new user if not found
    const newUser = await addUser({phone, name});
    return newUser as User;
}
