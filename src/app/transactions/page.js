"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AnimatedCard from "@/app/components/common/AnimatedCard";
import PurchaseHistory from "../components/PurchaseHistory";
import { Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";

export default function TransactionsPage() {
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          textAlign: "center",
          mb: 6,
          fontWeight: "bold",
          color: "#10b981",
        }}
      >
        Transaction History
      </Typography>
      <AnimatedCard>
        <PurchaseHistory userUid={userUid} />
      </AnimatedCard>
    </DashboardLayout>
  );
}
