"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import addMoneyTracker from "@/app/backend/MoneyTracker/moneyTracker";

/**
 * MoneyTracker component for tracking user expenses
 * Allows users to input purchase details including amount, category, and rating
 * @param {string} userUid - The user's unique identifier
 */
function MoneyTracker({ userUid }) {
  const [moneySpent, setMoneySpent] = useState("");
  const [bought, setBought] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    try {
      if (!userUid) {
        console.error("No user UID provided");
        return;
      }
      const moneySpentNumber = parseFloat(moneySpent);
      if (isNaN(moneySpentNumber)) {
        console.error("Invalid money amount");
        return;
      }
      await addMoneyTracker(
        bought,
        moneySpentNumber,
        rating,
        category,
        userUid
      );
      // Reset form after successful submission
      setMoneySpent("");
      setBought("");
      setRating(0);
      setCategory("");
      setSuccessMessage("Money tracker entry created successfully.");
    } catch (error) {
      console.error("Money tracker entry creation failed:", error);
    }
  };

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: { xs: 2, sm: 4 },
        backgroundColor: "transparent",
        borderRadius: 2,
        height: "100%",
        minHeight: "500px",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", color: "#10b981" }}
        data-cy="title"
      >
        Money Tracker
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 4,
          width: "100%",
          overflow: "auto",
          flex: 1,
          px: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: { xs: "100%", md: "45%", lg: "35%" },
            minWidth: { xs: "100%", md: "400px" },
          }}
        >
          <TextField
            required
            label="What was Bought?"
            variant="outlined"
            type="text"
            sx={{
              mt: 2,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.default",
                "&:hover": {
                  bgcolor: "background.paper",
                },
                "& fieldset": {
                  borderColor: "success.light",
                },
                "&:hover fieldset": {
                  borderColor: "success.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "success.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "success.main",
                "&.Mui-focused": {
                  color: "success.main",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "success.main",
              },
            }}
            value={bought}
            onChange={(e) => setBought(e.target.value)}
            inputProps={{ "data-cy": "bought-input" }}
          />
          <TextField
            required
            label="Money Spent"
            variant="outlined"
            type="number"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.default",
                "&:hover": {
                  bgcolor: "background.paper",
                },
                "& fieldset": {
                  borderColor: "success.light",
                },
                "&:hover fieldset": {
                  borderColor: "success.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "success.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "success.main",
                "&.Mui-focused": {
                  color: "success.main",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "success.main",
              },
              "& .MuiInputAdornment-root": {
                color: "success.main",
              },
            }}
            value={moneySpent}
            onChange={(e) => setMoneySpent(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            inputProps={{ "data-cy": "money-spent-input" }}
          />
          <FormControl
            variant="outlined"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                bgcolor: "background.default",
                "&:hover": {
                  bgcolor: "background.paper",
                },
                "& fieldset": {
                  borderColor: "success.light",
                },
                "&:hover fieldset": {
                  borderColor: "success.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "success.main",
                },
              },
              "& .MuiInputLabel-root": {
                color: "success.main",
                "&.Mui-focused": {
                  color: "success.main",
                },
              },
              "& .MuiSelect-select": {
                color: "success.main",
              },
              "& .MuiSvgIcon-root": {
                color: "success.main",
              },
            }}
          >
            <InputLabel htmlFor="category">Category</InputLabel>
            <Select
              native
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              inputProps={{
                name: "category",
                id: "category",
                "data-cy": "category-select",
              }}
            >
              <option aria-label="None" value="" />
              <option value="Food">🍔 Food</option>
              <option value="Clothing">👖 Clothing</option>
              <option value="Fuel/Gas">⛽ Fuel/Gas</option>
              <option value="Housing">🏡 Housing</option>
              <option value="Transportation">🚗 Vehicle</option>
              <option value="Entertainment">🎥 Entertainment</option>
              <option value="Savings">💰 Savings</option>
              <option value="Other">🛒 Other</option>
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            width: { xs: "100%", md: "45%", lg: "35%" },
            minWidth: { xs: "100%", md: "400px" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}
          >
            What would you rate this purchase?
          </Typography>
          <Rating
            required
            name="simple-controlled"
            defaultValue="no-value"
            precision={1}
            size="large"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            data-cy="rating"
            sx={{
              transform: "scale(1.5)",
              my: 2,
              "& .MuiRating-iconEmpty": {
                color: "#10b981",
                opacity: 0.3,
              },
              "& .MuiRating-iconFilled": {
                color: "#10b981",
              },
              "& .MuiRating-iconHover": {
                color: "#10b981",
              },
            }}
          />
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={() => handleSubmit(bought, moneySpent, rating)}
            data-cy="submit-button"
            sx={{
              mt: 2,
              px: 6,
              py: 1.5,
              fontSize: "1.1rem",
              backgroundColor: "#10b981",
              "&:hover": {
                backgroundColor: "#059669",
              },
            }}
          >
            Submit
          </Button>
          {successMessage && (
            <Typography
              variant="body1"
              color="#10b981"
              data-cy="success-message"
            >
              {successMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MoneyTracker;
