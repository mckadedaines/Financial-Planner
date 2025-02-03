// src/api/firebaseData.js
import { db } from '../firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';

export const getUserSpendingData = async (userId) => {
    const spendingData = [];
    const purchasesRef = collection(db, "moneyTracker", userId, "purchases");
    const q = query(purchasesRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      spendingData.push({ id: doc.id, ...doc.data() });
    });
    return spendingData;
  };
