"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { db } from "@/lib/firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

function PurchaseHistory({ userUid }) {
  const [rows, setRows] = useState([]);
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

          const purchases = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp.toDate().toLocaleString(),
            };
          });
          setRows(purchases);
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

  const columns = [
    {
      field: "bought",
      headerName: "Item Purchased",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "moneySpent",
      headerName: "Money Spent",
      type: "number",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#ef4444",
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            height: "100%",
          }}
        >
          ${Number(params.row.moneySpent).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "timestamp",
      headerName: "Purchase Time",
      flex: 1,
      minWidth: 180,
    },
  ];

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress sx={{ color: "#10b981" }} />
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: 400 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            density="comfortable"
            initialState={{
              sorting: {
                sortModel: [{ field: "timestamp", sort: "desc" }],
              },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                color: "text.primary",
                borderColor: "divider",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "transparent",
                color: "#10b981",
                borderColor: "divider",
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&.Mui-selected": {
                  backgroundColor: "#10b98120",
                  "&:hover": {
                    backgroundColor: "#10b98130",
                  },
                },
              },
              "& .MuiCheckbox-root": {
                color: "#10b981",
                "&.Mui-checked": {
                  color: "#10b981",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid",
                borderColor: "divider",
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography sx={{ color: "text.secondary" }}>
                    No transaction history found.
                  </Typography>
                </Box>
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default PurchaseHistory;
