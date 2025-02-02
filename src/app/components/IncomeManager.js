import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  Alert,
} from "@mui/material";
import {
  setMonthlyIncome,
  getMonthlyIncome,
} from "../backend/MoneyTracker/budgetManager";

export default function IncomeManager({ userUid }) {
  const [income, setIncome] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadIncome() {
      if (!userUid) return;
      try {
        const amount = await getMonthlyIncome(userUid);
        setIncome(amount.toString());
      } catch (err) {
        console.error("Error loading income data:", err);
      }
    }
    loadIncome();
  }, [userUid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await setMonthlyIncome(userUid, Number(income));
      setSuccess("Income updated successfully!");
      setIncome("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setIncome(value);
    }
  };

  if (!userUid) {
    return (
      <Alert severity="info">
        Please log in to manage your income settings.
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: "#10b981" }}
          >
            Monthly Income
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set your monthly income to track your budget effectively
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Income Amount"
            value={income}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#10b981",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: "auto" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#10b981",
              "&:hover": { bgcolor: "#059669" },
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Update Income
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
