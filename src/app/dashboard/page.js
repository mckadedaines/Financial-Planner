"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { Box, Typography, Grid, useTheme, alpha } from "@mui/material";
import MoneyTracker from "../components/MoneyTracker";
import PurchaseHistoryPieChart from "../components/PurchaseHistoryPieChart";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import GridLayout, { FullWidthGrid } from "../components/common/GridLayout";
import { subscribeToTransactionStats } from "../backend/MoneyTracker/transactionStats";
import BudgetManager from "../components/BudgetManager";
import IncomeManager from "../components/IncomeManager";
import {
  getMonthlyIncome,
  getMonthlyBudget,
} from "../backend/MoneyTracker/budgetManager";

function Page() {
  const theme = useTheme();
  const [userUid, setUserUid] = useState(null);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [stats, setStats] = useState([
    { title: "Total Expenses", value: "$0.00", change: "0%" },
    { title: "Monthly Expenses", value: "$0.00", change: "0%" },
    { title: "Average Per Purchase", value: "$0.00", change: "0%" },
    { title: "Total Purchases", value: "0", change: "0%" },
  ]);

  // Define colors for different stat types
  const statColors = {
    totalExpenses: "#ef4444", // red
    monthlyExpenses: "#f97316", // orange
    averagePurchase: "#8b5cf6", // purple
    totalPurchases: "#06b6d4", // cyan
  };

  // Load income and budget data
  useEffect(() => {
    async function loadFinancialData() {
      if (!userUid) return;
      try {
        const [incomeAmount, budgetAmount] = await Promise.all([
          getMonthlyIncome(userUid),
          getMonthlyBudget(userUid),
        ]);
        setIncome(incomeAmount);
        setBudget(budgetAmount);
      } catch (err) {
        console.error("Error loading financial data:", err);
      }
    }
    loadFinancialData();
  }, [userUid]);

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

  // Helper function to get stat box styling
  const getStatBoxStyle = (colorHex) => ({
    p: 3,
    bgcolor:
      theme.palette.mode === "light"
        ? alpha(colorHex, 0.1)
        : alpha(colorHex, 0.2),
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    boxShadow: 1,
    transition: "background-color 0.3s ease",
    "&:hover": {
      bgcolor:
        theme.palette.mode === "light"
          ? alpha(colorHex, 0.15)
          : alpha(colorHex, 0.25),
    },
  });

  // Helper function to get stat color based on title
  const getStatColor = (title) => {
    switch (title) {
      case "Total Expenses":
        return statColors.totalExpenses;
      case "Monthly Expenses":
        return statColors.monthlyExpenses;
      case "Average Per Purchase":
        return statColors.averagePurchase;
      case "Total Purchases":
        return statColors.totalPurchases;
      default:
        return theme.palette.text.primary;
    }
  };

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
                gap: 1.5,
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
                  sx={{ mb: 1.5, alignSelf: "flex-start" }}
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
                  gap: 1.5,
                  minWidth: { xs: "100%", md: "45%" },
                  height: "100%",
                }}
              >
                {/* Monthly Income Box */}
                <Box
                  sx={{
                    ...getStatBoxStyle("#10b981"),
                    p: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Monthly Income
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
                        wordBreak: "break-word",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        color: "#10b981",
                        fontWeight: 600,
                      }}
                    >
                      ${income.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Monthly Budget Box */}
                <Box
                  sx={{
                    ...getStatBoxStyle("#3b82f6"),
                    p: 2,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Monthly Budget
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
                        wordBreak: "break-word",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        color: "#3b82f6",
                        fontWeight: 600,
                      }}
                    >
                      ${budget.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Existing Stats */}
                {stats.map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      ...getStatBoxStyle(getStatColor(stat.title)),
                      p: 2,
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                      sx={{ mb: 1 }}
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
                          wordBreak: "break-word",
                          fontSize: { xs: "1.25rem", sm: "1.5rem" },
                          fontWeight: 600,
                          color: getStatColor(stat.title),
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: stat.change.startsWith("+")
                            ? statColors.totalExpenses
                            : theme.palette.success.main,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
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

      {/* Income and Budget Section */}
      <GridLayout>
        <FullWidthGrid>
          <Card
            title="Income & Budget Management"
            subtitle="Manage your monthly income and spending budget"
          >
            <Box sx={{ p: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <IncomeManager userUid={userUid} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BudgetManager userUid={userUid} />
                </Grid>
              </Grid>
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
