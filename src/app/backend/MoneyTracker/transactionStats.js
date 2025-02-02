import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const subscribeToTransactionStats = (userUid, onUpdate) => {
  if (!userUid) return () => {};

  const purchasesRef = collection(db, "moneyTracker", userUid, "purchases");
  const q = query(purchasesRef, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const purchases = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      moneySpent: parseFloat(doc.data().moneySpent),
    }));

    // Calculate total expenses
    const totalExpenses = purchases.reduce(
      (sum, purchase) => sum + purchase.moneySpent,
      0
    );

    // Calculate monthly expenses (current month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = purchases
      .filter((purchase) => {
        const purchaseDate = purchase.timestamp.toDate();
        return (
          purchaseDate.getMonth() === currentMonth &&
          purchaseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, purchase) => sum + purchase.moneySpent, 0);

    // Calculate previous month's expenses for comparison
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const previousMonthExpenses = purchases
      .filter((purchase) => {
        const purchaseDate = purchase.timestamp.toDate();
        return (
          purchaseDate.getMonth() === previousMonth &&
          purchaseDate.getFullYear() === previousYear
        );
      })
      .reduce((sum, purchase) => sum + purchase.moneySpent, 0);

    // Calculate month-over-month change
    const monthlyChange =
      previousMonthExpenses === 0
        ? "0%"
        : `${(
            ((monthlyExpenses - previousMonthExpenses) /
              previousMonthExpenses) *
            100
          ).toFixed(1)}%`;

    const stats = [
      {
        title: "Total Expenses",
        value: `$${totalExpenses.toFixed(2)}`,
        change: monthlyChange,
      },
      {
        title: "Monthly Expenses",
        value: `$${monthlyExpenses.toFixed(2)}`,
        change: monthlyChange,
      },
      {
        title: "Average Per Purchase",
        value: `$${(totalExpenses / (purchases.length || 1)).toFixed(2)}`,
        change: "0%",
      },
      {
        title: "Total Purchases",
        value: purchases.length.toString(),
        change: "0%",
      },
    ];

    onUpdate(stats);
  });

  return unsubscribe;
};
