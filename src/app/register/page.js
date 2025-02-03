"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import registerUser from "../backend/loginBackend/user";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyIcon from "@mui/icons-material/Key";
import CanvasBackground from "../components/CanvasBackground";
import Card from "../components/common/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // If verification is sent, wait a bit before redirecting
    if (verificationSent) {
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verificationSent, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData.email, formData.password);
      setVerificationSent(true);
    } catch (err) {
      setError(err.message || "Failed to create an account");
      setLoading(false);
    }
  };

  const containerStyles = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "background.default",
    p: { xs: 2, sm: 4 },
    "& > *": {
      position: "relative",
      zIndex: 1,
    },
  };

  const paperStyles = {
    width: "100%",
    maxWidth: "450px",
    position: "relative",
    zIndex: 2,
    backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(31, 41, 55, 0.9)"
        : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
  };

  const textFieldStyles = {
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
  };

  if (isRedirecting) {
    return (
      <Box sx={containerStyles}>
        <CanvasBackground />
        <CircularProgress />
      </Box>
    );
  }

  if (verificationSent) {
    return (
      <Box sx={containerStyles}>
        <CanvasBackground />
        <Card sx={paperStyles}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Account Created Successfully
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We&apos;ve sent a verification email to {formData.email}. Please
            check your inbox and click the verification link.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to verification page...
          </Typography>
          <CircularProgress size={24} sx={{ mt: 2 }} />
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={containerStyles}>
      <CanvasBackground />
      <Card sx={paperStyles}>
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
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => router.push("/")}
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
              Back to Sign In
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
