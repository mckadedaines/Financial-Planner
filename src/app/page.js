/**
 * Main login page component that handles user authentication
 * Provides a form for email/password login and navigation to registration
 */
"use client";
import { TextField, Box, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signInUser } from "./backend/loginBackend/user";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CanvasBackground from "./components/CanvasBackground";
import Card from "./components/common/Card";
import { useThemeContext } from "./theme/ThemeProvider";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const { mode, toggleTheme } = useThemeContext();

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
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(31, 41, 55, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
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
                    <AccountCircle />
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
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "text.secondary",
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
                    <KeyIcon />
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
                    borderColor: "primary.main",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "primary.main",
                },
                "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                  color: "text.secondary",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
              data-cy="login"
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease-in-out",
                boxShadow: "none",
                "&:hover": {
                  opacity: 0.9,
                  boxShadow: (theme) =>
                    `0 0 20px ${theme.palette.primary.main}`,
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
              color="primary"
              size="large"
              onClick={() => router.push("/register")}
              sx={{
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                  boxShadow: (theme) =>
                    `0 0 20px ${theme.palette.primary.main}`,
                  backdropFilter: "blur(20px)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Create an Account
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mt: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {mode === "dark" ? "Dark" : "Light"} mode
              </Typography>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  color: "text.secondary",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    color: "primary.main",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default Page;
