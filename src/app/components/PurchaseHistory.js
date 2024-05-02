"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { db } from "../backend/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";

function PurchaseHistory({ userUid }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (userUid) {
      const fetchData = async () => {
        const purchasesRef = collection(
          db,
          "moneyTracker",
          userUid,
          "purchases"
        );
        const querySnapshot = await getDocs(purchasesRef);
        const purchases = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
        }));
        setRows(purchases);
      };
      fetchData();
    }
  }, [userUid]);

  const columns = [
    { field: "bought", headerName: "Item Purchased", width: 200 },
    {
      field: "moneySpent",
      headerName: "Money Spent",
      type: "number",
      width: 150,
    },
    { field: "category", headerName: "Category", width: 150 },
    { field: "rating", headerName: "Rating", type: "number", width: 120 },
    { field: "timestamp", headerName: "Purchase Time", width: 200 },
  ];

  return (
    <Box className="mt-8">
      <Box className="text-center mb-6">
        <Typography
          variant="h3"
          component="h2"
          className="text-3xl font-bold text-slate-100"
        >
          Purchase History
        </Typography>
      </Box>
      <Box className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          density="standard"
          className="bg-gray-700 text-white"
          components={{
            NoRowsOverlay: () => (
              <Typography variant="body1" className="text-white">
                No purchase history found.
              </Typography>
            ),
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              color: "black",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default PurchaseHistory;
