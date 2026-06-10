import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CompanyProfile, DocumentItem, SubscriptionStatus } from '../types';

export const saveUserData = async (userId: string, profile: CompanyProfile, documents: DocumentItem[], subscriptionStatus?: SubscriptionStatus) => {
  // Serialize to JSON to safely handle Date objects and undefined values
  const dataToSave = JSON.parse(JSON.stringify({ profile, documents, subscriptionStatus }));
  await setDoc(doc(db, 'users', userId), dataToSave);
};

export const getUserData = async (userId: string): Promise<{profile: CompanyProfile, documents: DocumentItem[], subscriptionStatus?: SubscriptionStatus} | null> => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    
    // Rehydrate Date objects
    if (data.documents) {
        data.documents.forEach((d: any) => {
            if (d.lastUpdated) d.lastUpdated = new Date(d.lastUpdated);
            if (d.history) {
                d.history.forEach((h: any) => {
                    if (h.date) h.date = new Date(h.date);
                });
            }
        });
    }
    return { 
      profile: data.profile, 
      documents: data.documents || [],
      subscriptionStatus: data.subscriptionStatus
    };
  }
  return null;
};

export const getAllUsersData = async (): Promise<{id: string, profile: CompanyProfile, documents: DocumentItem[]}[]> => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  const users: {id: string, profile: CompanyProfile, documents: DocumentItem[]}[] = [];
  
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    
    // Rehydrate Date objects
    if (data.documents) {
        data.documents.forEach((d: any) => {
            if (d.lastUpdated) d.lastUpdated = new Date(d.lastUpdated);
            if (d.history) {
                d.history.forEach((h: any) => {
                    if (h.date) h.date = new Date(h.date);
                });
            }
        });
    }
    
    users.push({
      id: docSnap.id,
      profile: data.profile || {} as CompanyProfile,
      documents: data.documents || []
    });
  });
  
  return users;
};
