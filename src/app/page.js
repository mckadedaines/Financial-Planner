/**
 * Main login page component that handles user authentication
 * Provides a form for email/password login and navigation to registration
 */
"use client";
import { TextField, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signInUser } from "./backend/loginBackend/user";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import CanvasBackground from "./components/CanvasBackground";
import Card from "./components/common/Card";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }

    setError("");
    setEmailError(false);
    setPasswordError(false);

    try {
      const userCredential = await signInUser(email, password);
      if (userCredential && userCredential.user) {
        const idToken = await userCredential.user.getIdToken();
        router.push("/dashboard");
      } else {
        throw new Error("Failed to get user credentials");
      }
    } catch (error) {
      setError("Invalid email or password");
      setEmailError(true);
      setPasswordError(true);
      console.error("Error signing in user:", error);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        p: { xs: 2, sm: 4 },
        backgroundColor: "background.default",
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <CanvasBackground />
      <Card
        sx={{
          width: "100%",
          maxWidth: "450px",
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Box
          component="section"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: { xs: 3, sm: 4 },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "text.primary",
              mb: 2,
            }}
          >
            Welcome Back
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              error={emailError}
              required
              fullWidth
              label="Email"
              variant="outlined"
              helperText={emailError ? "Please enter a valid email" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
              inputProps={{ "data-cy": "email" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "text.primary",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "text.primary",
                },
              }}
            />
            <TextField
              error={passwordError}
              required
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              helperText={passwordError ? "Please enter a valid password" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon color="action" />
                  </InputAdornment>
                ),
              }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              inputProps={{ "data-cy": "password" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "text.primary",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "text.primary",
                },
              }}
            />
            <Button
              variant="contained"
              color="inherit"
              size="large"
              fullWidth
              onClick={handleLogin}
              data-cy="login"
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                color: "white",
                bgcolor: "text.primary",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease-in-out",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "text.primary",
                  opacity: 0.9,
                  boxShadow: (theme) =>
                    `0 0 20px ${theme.palette.text.primary}`,
                  backdropFilter: "blur(20px)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Sign In
            </Button>
            {error && (
              <Typography color="error" textAlign="center" fontSize="0.875rem">
                {error}
              </Typography>
            )}
            <Button
              data-cy="register"
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => router.push("/register")}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                color: "text.primary",
                borderColor: "text.primary",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: (theme) =>
                    `0 0 20px ${theme.palette.text.primary}`,
                  backdropFilter: "blur(20px)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Create an Account
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default Page;
