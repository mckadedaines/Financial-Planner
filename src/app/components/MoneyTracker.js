"use client";
import { Box, TextField, Button, Typography, Rating } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useState } from "react";
import addMoneyTracker from "@/app/backend/MoneyTracker/moneyTracker";
import { FormControl, InputLabel, Select } from "@mui/material";

function MoneyTracker() {
  const [moneySpent, setMoneySpent] = useState(0);
  const [bought, setBought] = useState("");
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    try {
      await addMoneyTracker(bought, moneySpent, rating, category);
      console.log("Money tracker entry created");
      setMoneySpent(0);
      setBought("");
      setRating(0);
      setCategory("");
    } catch (error) {
      console.error("Money tracker entry creation failed:", error);
    }
  };

  return (
    <Box
      component="section"
      className="flex flex-col items-center space-y-4 rounded-xl pl-14 pr-14 pt-5 pb-5 bg-slate-200"
    >
      <Typography variant="h4" className="text-center font-bold">
        Money Tracker
      </Typography>
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
      />
      <Button
        variant="contained"
        color="success"
        type="submit"
        onClick={() => {
          handleSubmit(bought, moneySpent, rating);
        }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default MoneyTracker;
