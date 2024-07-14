"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/firebaseConfig";
import { Box, Typography, Grid, Paper } from "@mui/material";
import MoneyTracker from "../components/MoneyTracker";
import PurchaseHistory from "../components/PurchaseHistory";
import PurchaseHistoryPieChart from "../components/PurchaseHistoryPieChart";
import ChatGPTComponent from "../components/ChatGptComponent";
import CanvasBackground from "../components/CanvasBackground"; // Import CanvasBackground

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
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative", // Ensure that the background canvas is properly positioned
      }}
    >
      <CanvasBackground /> {/* Add CanvasBackground here */}
      <Typography
        variant="h2"
        align="center"
        className="text-slate-100 mb-6 font-bold"
      >
        Dashboard
      </Typography>
      <Grid container spacing={2} style={{ alignItems: "stretch" }}>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Paper
            style={{
              width: "100%",
              flexGrow: 1,
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
            }}
          >
            <PurchaseHistoryPieChart userUid={userUid} />
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Paper
            style={{
              width: "100%",
              flexGrow: 1,
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
            }}
          >
            <MoneyTracker userUid={userUid} />
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <Paper
            style={{
              width: "100%",
              flexGrow: 1,
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
            }}
          >
            <PurchaseHistory userUid={userUid} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            style={{
              width: "100%",
              flexGrow: 1,
              padding: "20px",
              backgroundColor: "#2D3748",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <ChatGPTComponent />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Page;
