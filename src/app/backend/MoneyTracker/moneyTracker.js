import { Category } from "@mui/icons-material";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

/**
 * Add a new money tracker entry to the user's purchase history
 * @param {string} bought - Description of the item purchased
 * @param {number} moneySpent - Amount spent on the purchase
 * @param {number} rating - User's rating of the purchase
 * @param {string} category - Category of the purchase
 * @param {string} userUid - User's unique identifier
 * @returns {Promise<void>}
 * @throws {Error} If no user UID is provided or if the operation fails
 */
async function addMoneyTracker(bought, moneySpent, rating, category, userUid) {
  if (!userUid) {
    throw new Error("No user UID provided");
  }

  // Create a new document in the "moneyTracker" collection within a user-specific subcollection
  await addDoc(collection(db, "moneyTracker", userUid, "purchases"), {
    bought,
    moneySpent,
    rating,
    category,
    timestamp: new Date(),
  });
}

export default addMoneyTracker;
