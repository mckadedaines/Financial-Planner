"use client";
import { TextField, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signInUser } from "./backend/loginBackend/user";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      // Set error if any field is empty
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }

    // Reset errors on new submission attempt
    setError("");
    setEmailError(false);
    setPasswordError(false);

    try {
      await signInUser(email, password);
      console.log("User signed in!");
      router.push("/Dashboard");
    } catch (error) {
      setError("Invalid email or password");
      setEmailError(true);
      setPasswordError(true);
      console.error("Error signing in user:", error);
    }
  };

  return (
    <Box
      component="section"
      className="flex h-screen justify-center items-center bg-gray-700"
    >
      <Box
        component="section"
        className="flex flex-col items-center space-y-4 rounded-xl pl-10 pr-10 bg-slate-200"
      >
        <Box component="section" className="m-24">
          <Typography variant="h2" className="text-center font-bold" mb={4}>
            User Login
          </Typography>
          <Box component="section" className="flex flex-col gap-6">
            <TextField
              error={emailError}
              required
              color="success"
              label="Username"
              id="outlined-basic"
              helperText={emailError ? "Please enter a valid email" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
            />
            <TextField
              error={passwordError}
              required
              color="success"
              label="Password"
              id="outlined-basic"
              helperText={passwordError ? "Please enter a valid password" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handleLogin}
            >
              Login
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                router.push("/NewUser");
              }}
            >
              Need an account?
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Page;
