"use client";

import DashboardLayout from "../components/layout/DashboardLayout";
import AnimatedCard from "@/app/components/common/AnimatedCard";
import GridLayout, { FullWidthGrid } from "../components/common/GridLayout";
import { Typography, Box, Tab, Tabs } from "@mui/material";
import { useState, useEffect } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseConfig";
import { CircularProgress } from "@mui/material";
import { getMonthlyIncome } from "../backend/MoneyTracker/budgetManager";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState(0);
  const [userUid, setUserUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    monthlyData: [],
    categoryData: [],
    savingsData: [],
  });

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });
    return () => unsubscribe();
  }, []); // Empty dependency array since we only want this to run once

  // Fetch and process transaction and income data
  useEffect(() => {
    if (!userUid) {
      setLoading(false);
      return;
    }

    let isSubscribed = true;
    let unsubscribeSnapshot = null;

    async function fetchData() {
      try {
        setLoading(true);
        // Get monthly income first
        const monthlyIncome = await getMonthlyIncome(userUid);

        const purchasesRef = collection(
          db,
          "moneyTracker",
          userUid,
          "purchases"
        );
        const q = query(purchasesRef, orderBy("timestamp", "desc"));

        unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          if (!isSubscribed) return;

          const now = new Date();
          const sixMonthsAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            1
          );
          const yearStart = new Date(now.getFullYear(), 0, 1);
          const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);

          const startDate =
            timeRange === 1
              ? yearStart
              : timeRange === 2
              ? lastYear
              : sixMonthsAgo;

          const transactions = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
            type: doc.data().type || "expense",
            amount:
              Number(doc.data().moneySpent) || Number(doc.data().amount) || 0,
          }));

          const filteredTransactions = transactions.filter(
            (t) => t.timestamp >= startDate
          );

          // Process monthly data
          const monthlyDataMap = new Map();
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          // Initialize months
          for (
            let d = new Date(startDate);
            d <= now;
            d.setMonth(d.getMonth() + 1)
          ) {
            const monthKey = months[d.getMonth()];
            monthlyDataMap.set(monthKey, {
              month: monthKey,
              expenses: 0,
              income: monthlyIncome, // Set base monthly income
            });
          }

          // Process transactions
          const categoryMap = new Map();
          filteredTransactions.forEach((t) => {
            const monthKey = months[t.timestamp.getMonth()];
            const amount = t.amount;

            if (monthlyDataMap.has(monthKey)) {
              const monthData = monthlyDataMap.get(monthKey);
              if (t.type === "income") {
                monthData.income += amount;
              } else {
                monthData.expenses += amount;
                categoryMap.set(
                  t.category,
                  (categoryMap.get(t.category) || 0) + amount
                );
              }
            }
          });

          const totalExpenses = filteredTransactions
            .filter((t) => t.type !== "income")
            .reduce((acc, t) => acc + t.amount, 0);

          const newAnalyticsData = {
            monthlyData: Array.from(monthlyDataMap.values()),
            categoryData: Array.from(categoryMap.entries()).map(
              ([label, value], id) => ({
                id,
                label,
                value: totalExpenses
                  ? Math.round((value / totalExpenses) * 100)
                  : 0,
              })
            ),
            savingsData: Array.from(monthlyDataMap.values()).map((m) => ({
              month: m.month,
              amount: m.income - m.expenses,
            })),
          };

          if (isSubscribed) {
            setAnalyticsData(newAnalyticsData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error setting up analytics:", error);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isSubscribed = false;
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, [userUid, timeRange]);

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress sx={{ color: "#10b981" }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
            color: "#10b981",
          }}
        >
          Financial Analytics
        </Typography>

        <Tabs
          value={timeRange}
          onChange={handleTimeRangeChange}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
        >
          <Tab label="Last 6 Months" />
          <Tab label="Year to Date" />
          <Tab label="Last Year" />
        </Tabs>
      </Box>

      <GridLayout spacing={4}>
        {/* Income vs Expenses Chart */}
        <FullWidthGrid>
          <AnimatedCard
            title="Income vs Expenses"
            subtitle="Monthly comparison of income and expenses"
            sx={{ p: 2 }}
          >
            <Box
              sx={{
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BarChart
                xAxis={[
                  {
                    data: analyticsData.monthlyData.map((d) => d.month),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: analyticsData.monthlyData.map((d) => d.income),
                    label: "Income",
                    color: "#10b981",
                  },
                  {
                    data: analyticsData.monthlyData.map((d) => d.expenses),
                    label: "Expenses",
                    color: "#ef4444",
                  },
                ]}
                width={800}
                height={350}
              />
            </Box>
          </AnimatedCard>
        </FullWidthGrid>

        {/* Expense Categories */}
        <FullWidthGrid>
          <AnimatedCard
            title="Expense Categories"
            subtitle="Distribution of expenses by category"
            sx={{ p: 2 }}
          >
            <Box
              sx={{
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieChart
                series={[
                  {
                    data: analyticsData.categoryData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                width={800}
                height={350}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 8,
                    itemMarkWidth: 16,
                    itemMarkHeight: 16,
                    markGap: 5,
                    itemGap: 8,
                  },
                }}
              />
            </Box>
          </AnimatedCard>
        </FullWidthGrid>

        {/* Savings Trend */}
        <FullWidthGrid>
          <AnimatedCard
            title="Savings Trend"
            subtitle="Monthly savings analysis"
            sx={{ p: 2 }}
          >
            <Box
              sx={{
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LineChart
                xAxis={[
                  {
                    data: analyticsData.savingsData.map((d) => d.month),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: analyticsData.savingsData.map((d) => d.amount),
                    label: "Savings",
                    color: "#3b82f6",
                    area: true,
                  },
                ]}
                width={800}
                height={350}
              />
            </Box>
          </AnimatedCard>
        </FullWidthGrid>
      </GridLayout>
    </DashboardLayout>
  );
}
