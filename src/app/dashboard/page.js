"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/firebaseConfig";
import { Box, Typography, Grid } from "@mui/material";
import MoneyTracker from "../components/MoneyTracker";
import PurchaseHistory from "../components/PurchaseHistory";
import PurchaseHistoryPieChart from "../components/PurchaseHistoryPieChart";

function Page() {
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <Box className="bg-gray-700 pt-10 h-screen">
      <Typography
        variant="h2"
        align="center"
        className="text-slate-100 mb-6 font-bold"
      >
        Dashboard
      </Typography>
      <Grid container spacing={2} style={{ alignItems: "stretch" }}>
        <Grid item xs={6} style={{ display: "flex", flexDirection: "column" }}>
          <Box
            style={{
              width: "100%",
              flexGrow: 1, // Make the box grow to fill the space
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
            }}
          >
            <PurchaseHistoryPieChart userUid={userUid} />
          </Box>
        </Grid>
        <Grid
          item
          xs={5.8}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            style={{
              width: "100%",
              flexGrow: 1, // Make the box grow to fill the space
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
            }}
          >
            <MoneyTracker userUid={userUid} />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <PurchaseHistory userUid={userUid} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Page;
