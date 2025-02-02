import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export async function getTransactionStats() {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }

    const purchasesRef = collection(db, "moneyTracker", user.uid, "purchases");
    const querySnapshot = await getDocs(purchasesRef);

    let totalSpent = 0;
    let monthlyExpenses = 0;
    let monthlySavings = 0;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalSpent += parseFloat(data.moneySpent);

      // Calculate monthly figures
      const timestamp = data.timestamp.toDate();
      if (timestamp >= firstDayOfMonth) {
        if (data.category === "Savings") {
          monthlySavings += parseFloat(data.moneySpent);
        } else {
          monthlyExpenses += parseFloat(data.moneySpent);
        }
      }
    });

    // Calculate month-over-month changes (you'll need to implement this based on your needs)
    // For now, using placeholder values
    const stats = [
      {
        title: "Total Balance",
        value: `$${totalSpent.toFixed(2)}`,
        change: "+0%", // You'll need to implement the actual calculation
      },
      {
        title: "Monthly Savings",
        value: `$${monthlySavings.toFixed(2)}`,
        change: "+0%",
      },
      {
        title: "Monthly Expenses",
        value: `$${monthlyExpenses.toFixed(2)}`,
        change: "+0%",
      },
      {
        title: "Investment Returns",
        value: "$0.00", // This would need to be implemented based on your investment tracking
        change: "+0%",
      },
    ];

    return stats;
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    throw error;
  }
}
