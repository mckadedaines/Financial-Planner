import { db } from "../firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const DEFAULT_BUDGET_SETTINGS = {
  monthlyIncome: 0,
  monthlyBudget: 0,
  savingsGoal: 0,
  updatedAt: new Date(),
};

/**
 * Add a new income entry
 * @param {string} userUid - User's unique identifier
 * @param {object} income - Income entry object
 * @returns {Promise<void>}
 */
export async function addIncomeEntry(userUid, income) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const incomeRef = collection(db, "moneyTracker", userUid, "income");
  await addDoc(incomeRef, {
    ...income,
    timestamp: new Date(),
  });
}

/**
 * Get latest income entry
 * @param {string} userUid - User's unique identifier
 * @returns {Promise<object|null>}
 */
export async function getLatestIncome(userUid) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const incomeRef = collection(db, "moneyTracker", userUid, "income");
  const q = query(incomeRef, orderBy("timestamp", "desc"), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

/**
 * Subscribe to income changes
 * @param {string} userUid - User's unique identifier
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export function subscribeToIncome(userUid, callback) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const incomeRef = collection(db, "moneyTracker", userUid, "income");
  const q = query(incomeRef, orderBy("timestamp", "desc"), limit(1));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    }
  });
}

/**
 * Add a new budget entry
 * @param {string} userUid - User's unique identifier
 * @param {object} budget - Budget entry object
 * @returns {Promise<void>}
 */
export async function addBudgetEntry(userUid, budget) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const budgetRef = collection(db, "moneyTracker", userUid, "budgets");
  await addDoc(budgetRef, {
    ...budget,
    timestamp: new Date(),
  });
}

/**
 * Get latest budget entry
 * @param {string} userUid - User's unique identifier
 * @returns {Promise<object|null>}
 */
export async function getLatestBudget(userUid) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const budgetRef = collection(db, "moneyTracker", userUid, "budgets");
  const q = query(budgetRef, orderBy("timestamp", "desc"), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

/**
 * Subscribe to budget changes
 * @param {string} userUid - User's unique identifier
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export function subscribeToBudget(userUid, callback) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const budgetRef = collection(db, "moneyTracker", userUid, "budgets");
  const q = query(budgetRef, orderBy("timestamp", "desc"), limit(1));

  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    }
  });
}

/**
 * Update user's income and budget settings
 * @param {string} userUid - User's unique identifier
 * @param {object} settings - Budget settings object
 * @returns {Promise<void>}
 */
export async function updateBudgetSettings(userUid, settings) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  // Add new income entry if income has changed
  if (settings.monthlyIncome) {
    await addIncomeEntry(userUid, {
      amount: settings.monthlyIncome,
      type: "monthly",
      description: "Monthly Income",
    });
  }

  // Add new budget entry if budget has changed
  if (settings.monthlyBudget) {
    await addBudgetEntry(userUid, {
      amount: settings.monthlyBudget,
      type: "monthly",
      description: "Monthly Budget",
    });
  }

  const docRef = doc(db, "moneyTracker", userUid);
  await setDoc(docRef, { exists: true }, { merge: true });

  const budgetDocRef = doc(db, "moneyTracker", userUid, "settings", "budget");
  await setDoc(budgetDocRef, {
    ...settings,
    updatedAt: new Date(),
  });
}

/**
 * Get user's current budget settings
 * @param {string} userUid - User's unique identifier
 * @returns {Promise<object>}
 */
export async function getBudgetSettings(userUid) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const docRef = doc(db, "moneyTracker", userUid, "settings", "budget");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // If document doesn't exist, create it with default values
    await setDoc(docRef, DEFAULT_BUDGET_SETTINGS);
    return DEFAULT_BUDGET_SETTINGS;
  }

  return docSnap.data();
}

/**
 * Subscribe to budget settings changes
 * @param {string} userUid - User's unique identifier
 * @param {function} callback - Callback function to handle updates
 * @returns {function} Unsubscribe function
 */
export function subscribeToBudgetSettings(userUid, callback) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  const docRef = doc(db, "moneyTracker", userUid, "settings", "budget");
  return onSnapshot(
    docRef,
    (doc) => {
      if (!doc.exists()) {
        // If document doesn't exist during subscription, return default values
        callback(DEFAULT_BUDGET_SETTINGS);
        // Create the document with default values
        setDoc(docRef, DEFAULT_BUDGET_SETTINGS);
      } else {
        callback(doc.data());
      }
    },
    (error) => {
      console.error("Error in budget settings subscription:", error);
      callback(DEFAULT_BUDGET_SETTINGS);
    }
  );
}

/**
 * Set user's monthly income
 * @param {string} userUid - User's unique identifier
 * @param {number} amount - Monthly income amount
 */
export async function setMonthlyIncome(userUid, amount) {
  if (!userUid) throw new Error("No user UID provided");

  const docRef = doc(db, "moneyTracker", userUid, "settings", "income");
  await setDoc(docRef, {
    amount: Number(amount),
    updatedAt: new Date(),
  });
}

/**
 * Get user's monthly income
 * @param {string} userUid - User's unique identifier
 */
export async function getMonthlyIncome(userUid) {
  if (!userUid) throw new Error("No user UID provided");

  const docRef = doc(db, "moneyTracker", userUid, "settings", "income");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().amount : 0;
}

/**
 * Set user's monthly budget
 * @param {string} userUid - User's unique identifier
 * @param {number} amount - Monthly budget amount
 */
export async function setMonthlyBudget(userUid, amount) {
  if (!userUid) throw new Error("No user UID provided");

  const docRef = doc(db, "moneyTracker", userUid, "settings", "budget");
  await setDoc(docRef, {
    amount: Number(amount),
    updatedAt: new Date(),
  });
}

/**
 * Get user's monthly budget
 * @param {string} userUid - User's unique identifier
 */
export async function getMonthlyBudget(userUid) {
  if (!userUid) throw new Error("No user UID provided");

  const docRef = doc(db, "moneyTracker", userUid, "settings", "budget");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().amount : 0;
}
