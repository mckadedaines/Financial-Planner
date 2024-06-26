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

function MoneyTracker() {
  const [moneySpent, setMoneySpent] = useState(0);
  const [bought, setBought] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await addMoneyTracker(bought, moneySpent, rating, category);
      console.log("Money tracker entry created");
      setMoneySpent(0);
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
      className="flex flex-col items-center justify-between space-y-4 rounded-xl pl-14 pr-14 pt-5 pb-5 bg-slate-200"
      style={{ height: "100%" }} // Ensuring the component fills the parent's height
    >
      <Typography
        variant="h4"
        className="text-center font-bold"
        data-cy="title"
      >
        Money Tracker
      </Typography>
      <div
        style={{
          flex: 1,
          alignSelf: "stretch",
          width: "100%",
          overflow: "auto",
        }}
      >
        <TextField
          required
          label="What was Bought?"
          variant="outlined"
          type="text"
          sx={{
            width: "300px",
            margin: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
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
            width: "300px",
            margin: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
          }}
          value={moneySpent}
          onChange={(e) => setMoneySpent(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          inputProps={{ "data-cy": "money-spent-input" }}
        />
        <FormControl
          variant="outlined"
          sx={{
            width: "300px",
            margin: "20px",
            backgroundColor: "white",
            borderRadius: "5px",
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
            <option value="Electronics">⛽ Fuel/Gas</option>
            <option value="Housing">🏡 Housing</option>
            <option value="Transportation">🚗 Vehicle</option>
            <option value="Entertainment">🎥 Entertainment</option>
            <option value="Savings">💰 Savings</option>
            <option value="Other">🛒 Other</option>
          </Select>
        </FormControl>
      </div>
      <Typography variant="h6" className="text-center font-bold">
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
      />
      <Button
        variant="contained"
        color="success"
        type="submit"
        onClick={() => handleSubmit(bought, moneySpent, rating)}
        data-cy="submit-button"
      >
        Submit
      </Button>
      {successMessage && (
        <Typography variant="body1" color="success" data-cy="success-message">
          {successMessage}
        </Typography>
      )}
    </Box>
  );
}

export default MoneyTracker;
