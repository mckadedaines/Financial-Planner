"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../backend/firebaseConfig";
import { Box, Typography, Grid, Paper } from "@mui/material";
import MoneyTracker from "../components/MoneyTracker";
import PurchaseHistoryPieChart from "../components/PurchaseHistoryPieChart";
import ChatGPTComponent from "../components/ChatGptComponent";
import CanvasBackground from "../components/CanvasBackground"; // Import CanvasBackground
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import GridLayout, {
  QuarterWidthGrid,
  HalfWidthGrid,
  FullWidthGrid,
} from "../components/common/GridLayout";
import { LinearProgress } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { subscribeToTransactionStats } from "../backend/MoneyTracker/transactionStats";

function Page() {
  const [userUid, setUserUid] = useState(null);
  const [stats, setStats] = useState([
    { title: "Total Expenses", value: "$0.00", change: "0%" },
    { title: "Monthly Expenses", value: "$0.00", change: "0%" },
    { title: "Average Per Purchase", value: "$0.00", change: "0%" },
    { title: "Total Purchases", value: "0", change: "0%" },
  ]);

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

  // Subscribe to real-time transaction stats
  useEffect(() => {
    if (!userUid) return;

    const unsubscribe = subscribeToTransactionStats(userUid, (newStats) => {
      setStats(newStats);
    });

    return () => unsubscribe();
  }, [userUid]);

  return (
    <DashboardLayout>
      {/* Stats and Pie Chart Section */}
      <GridLayout>
        <FullWidthGrid>
          <Card sx={{ height: "500px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: "100%",
                gap: 2,
                p: 2,
              }}
            >
              {/* Pie Chart Section */}
              <Box
                sx={{
                  flex: 1.2,
                  minWidth: { xs: "100%", md: "55%" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, alignSelf: "flex-start" }}
                >
                  Expense Distribution
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PurchaseHistoryPieChart userUid={userUid} />
                </Box>
              </Box>

              {/* Stats Grid Section */}
              <Box
                sx={{
                  flex: 0.8,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                  minWidth: { xs: "100%", md: "45%" },
                }}
              >
                {stats.map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 3,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      boxShadow: 1,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      {stat.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          mb: 1,
                          wordBreak: "break-word",
                          fontSize: { xs: "1.5rem", sm: "1.75rem" },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          stat.change.startsWith("+")
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {stat.change} from last month
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </FullWidthGrid>
      </GridLayout>

      {/* Money Tracker */}
      <GridLayout>
        <FullWidthGrid>
          <Card title="Money Tracker" subtitle="Track your daily expenses">
            <MoneyTracker userUid={userUid} />
          </Card>
        </FullWidthGrid>
      </GridLayout>
    </DashboardLayout>
  );
}

export default Page;
