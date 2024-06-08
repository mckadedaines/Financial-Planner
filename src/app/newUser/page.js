"use client";
import { TextField, Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import registerUser from "@/app/backend/loginBackend/user";
import { useRouter } from "next/navigation";

function NewUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(email, password);
      console.log("User Registered!");
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      className="flex h-screen justify-center items-center bg-gray-700"
    >
      <Box
        component="section"
        className="flex flex-col items-center space-y-4 rounded-xl pl-10 pr-10 bg-slate-200"
      >
        <Box component="section" className="m-24">
          <Typography variant="h2" className="text-center font-bold" mb={4}>
            New User Registration
          </Typography>
          <Box component="section" className="flex flex-col gap-6">
            <TextField
              color="success"
              label="Email"
              id="outlined-basic"
              error={Boolean(errorMessage)}
              helperText={errorMessage}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              inputProps={{ 'data-cy': 'email' }}
            />
            <TextField
              color="success"
              label="Password"
              id="outlined-basic"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              inputProps={{ 'data-cy': 'password' }}
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              data-cy="submit"
            >
              Register
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                router.push("/");
              }}
            >
              Already have an account? Sign in!
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default NewUser;
