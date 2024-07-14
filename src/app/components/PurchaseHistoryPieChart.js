"use client";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../backend/firebaseConfig";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { PieChart } from "@mui/x-charts";

// Assigning specific colors to each category
const COLORS = {
  Food: "#34D399", // Emerald
  Clothing: "#60A5FA", // Sky
  Electronics: "#FBBF24", // Amber
  Housing: "#EF4444", // Red
  Transportation: "#A78BFA", // Violet
  Entertainment: "#10B981", // Green
  Savings: "#EC4899", // Pink
  Other: "#6B7280", // Slate
};

const PurchaseHistoryPieChart = ({ userUid }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!userUid) {
      console.warn("No user UID provided");
      return;
    }

    const purchasesRef = collection(db, "moneyTracker", userUid, "purchases");

    const unsubscribe = onSnapshot(
      purchasesRef,
      (querySnapshot) => {
        const purchases = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
        }));

        const groupedPurchases = purchases.reduce((acc, purchase) => {
          const { category, moneySpent } = purchase;
          const cost = parseFloat(moneySpent);
          if (!isNaN(cost)) {
            acc[category] = acc[category] ? acc[category] + cost : cost;
          }
          return acc;
        }, {});

        const chartData = Object.keys(groupedPurchases).map((category) => ({
          id: category,
          value: groupedPurchases[category],
          Label: category,
          color: COLORS[category] || COLORS.Other, // Using custom color if available, fallback to 'Other'
        }));

        setData(chartData);
      },
      (error) => {
        console.error("Error fetching or processing data:", error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userUid]);

  return (
    <Box className="flex flex-col items-center h-full mx-8 my-4">
      {data.length === 0 ? (
        <Typography variant="h6" className="text-slate-100">
          No data available
        </Typography>
      ) : (
        <>
          <PieChart
            series={[
              {
                data,
                innerRadius: "80%",
                outerRadius: "100%",
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                arcLabel: () => null, // Explicitly returning null for no labels
              },
            ]}
            sx={{
              "& .MuiPieArc-root": {
                transition: "transform 0.3s ease-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              },
            }}
            width={400}
            height={300}
            tooltip={false} // Ensures tooltips are disabled
          />
          <Grid container spacing={2} className="mt-4">
            {data.map((entry, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={3}
                  style={{ padding: 10, textAlign: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ color: entry.color }}
                  >
                    {entry.Label}
                  </Typography>
                  <Typography variant="h6">
                    ${entry.value.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PurchaseHistoryPieChart;
