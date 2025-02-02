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
  setMonthlyBudget,
  getMonthlyBudget,
} from "../backend/MoneyTracker/budgetManager";

export default function BudgetManager({ userUid }) {
  const [budget, setBudget] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadBudget() {
      if (!userUid) return;
      try {
        const amount = await getMonthlyBudget(userUid);
        setBudget(amount.toString());
      } catch (err) {
        console.error("Error loading budget data:", err);
      }
    }
    loadBudget();
  }, [userUid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await setMonthlyBudget(userUid, Number(budget));
      setSuccess("Budget updated successfully!");
      setBudget("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setBudget(value);
    }
  };

  if (!userUid) {
    return (
      <Alert severity="info">
        Please log in to manage your budget settings.
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
            Monthly Budget
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set your monthly spending budget to manage expenses
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
            label="Budget Amount"
            value={budget}
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
            Update Budget
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
