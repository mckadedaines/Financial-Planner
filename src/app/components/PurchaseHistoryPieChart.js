"use client";
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../backend/firebaseConfig";
import { Box, Typography, Grid } from "@mui/material";

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
    const fetchData = async () => {
      const purchasesRef = collection(db, "moneyTracker", userUid, "purchases");
      const querySnapshot = await getDocs(purchasesRef);
      const purchases = querySnapshot.docs.map((doc) => ({
        id: doc.id,
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

      const chartData = Object.entries(groupedPurchases).map(
        ([category, cost]) => ({
          name: category,
          value: cost,
        })
      );

      setData(chartData);
    };

    fetchData();
  }, [userUid]);

  return (
    <Box className="flex flex-col items-center h-full mx-8 my-4">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Grid container spacing={2} className="mt-4">
        {data.map((entry, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Typography
              variant="body1"
              style={{ color: COLORS[entry.name], fontWeight: "bold" }}
            >
              {entry.name}: ${entry.value.toFixed(2)}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PurchaseHistoryPieChart;
