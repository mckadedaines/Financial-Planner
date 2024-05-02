import { Category } from "@mui/icons-material";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// Money Tracker
async function addMoneyTracker(bought, moneySpent, rating, category) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }

    // Create a new document in the "moneyTracker" collection within a user-specific subcollection
    await addDoc(collection(db, "moneyTracker", user.uid, "purchases"), {
      bought,
      moneySpent,
      rating,
      category,
      timestamp: new Date(), // Optionally add a timestamp
    });
    console.log("Money tracker entry created");
  } catch (error) {
    console.error("Money tracker entry creation failed:", error);
    throw error; // Re-throw to ensure calling function can handle it
  }
}

export default addMoneyTracker;
