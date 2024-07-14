"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { db } from "../backend/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

function PurchaseHistory({ userUid }) {
  const [rows, setRows] = useState([]);

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
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toLocaleString(),
        }));
        setRows(purchases);
      },
      (error) => {
        console.error("Error fetching or processing data:", error);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userUid]);

  const columns = [
    { field: "bought", headerName: "Item Purchased", flex: 1, minWidth: 150 }, // Using flex and minWidth for responsiveness
    {
      field: "moneySpent",
      headerName: "Money Spent",
      type: "number",
      flex: 1,
      minWidth: 120,
    },
    { field: "category", headerName: "Category", flex: 1, minWidth: 130 },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      flex: 1,
      minWidth: 100,
    },
    { field: "timestamp", headerName: "Purchase Time", flex: 1, minWidth: 180 },
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
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "white", // Change Rows per page section text and pagination display text color to white
              },
            "& .MuiTablePagination-select, & .MuiInputBase-input": {
              color: "white", // Change select input text color
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default PurchaseHistory;
