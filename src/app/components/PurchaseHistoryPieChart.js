"use client";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../backend/firebaseConfig";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { PieChart } from "@mui/x-charts";

// Assigning specific colors to each category with updated theme colors
const COLORS = {
  Food: "#10b981", // Primary mint green
  Clothing: "#60a5fa", // Light blue
  "Fuel/Gas": "#fbbf24", // Warm yellow
  Housing: "#f87171", // Soft red
  Transportation: "#a78bfa", // Soft purple
  Entertainment: "#34d399", // Light green
  Savings: "#f472b6", // Soft pink
  Other: "#9ca3af", // Cool gray
};

const PurchaseHistoryPieChart = ({ userUid }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!userUid);

  useEffect(() => {
    let isSubscribed = true;
    let unsubscribe = () => {};

    if (!userUid) {
      return () => {};
    }

    try {
      const purchasesRef = collection(db, "moneyTracker", userUid, "purchases");
      unsubscribe = onSnapshot(
        purchasesRef,
        (querySnapshot) => {
          if (!isSubscribed) return;

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
            color: COLORS[category] || COLORS.Other,
          }));

          setData(chartData);
          setLoading(false);
        },
        (error) => {
          if (!isSubscribed) return;
          console.error("Error fetching or processing data:", error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up listener:", error);
      setLoading(false);
    }

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [userUid]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: "#10b981" }} />
      ) : data.length === 0 ? (
        <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          No data available
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "500px",
            height: "450px",
          }}
        >
          <PieChart
            series={[
              {
                data,
                innerRadius: 100,
                outerRadius: 150,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                paddingAngle: 2,
                arcLabel: (item) =>
                  item.highlighted ? `$${item.value.toFixed(0)}` : "",
                arcLabelMinAngle: 45,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 98,
                  additionalRadius: -30,
                  color: "gray",
                },
                valueFormatter: (item) =>
                  `${item.Label}: $${item.value.toFixed(2)}`,
              },
            ]}
            sx={{
              "& .MuiPieArc-root": {
                transition: "transform 0.3s ease-out",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              },
              "& .MuiChartsLegend-label": {
                fill: "#10b981",
              },
              "& .MuiChartsLegend-mark": {
                rx: 10,
                ry: 10,
              },
              "& .MuiPieArcLabel-root": {
                fill: "white !important",
                fontSize: "1.2rem !important",
                fontWeight: "bold !important",
              },
            }}
            width={500}
            height={450}
            margin={{
              right: 160,
              left: 20,
              top: 40,
              bottom: 40,
            }}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: 8,
                itemMarkWidth: 16,
                itemMarkHeight: 16,
                markGap: 5,
                itemGap: 8,
                labelStyle: {
                  fontSize: 12,
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PurchaseHistoryPieChart;
