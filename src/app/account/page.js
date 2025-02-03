"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { auth } from "@/lib/firebase/firebaseConfig";
import {
  updatePassword,
  verifyBeforeUpdateEmail,
  sendEmailVerification,
} from "firebase/auth";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

const buttonSx = {
  py: 1.5,
  px: 4,
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
    boxShadow: (theme) => `0 0 20px ${theme.palette.text.primary}`,
    backdropFilter: "blur(20px)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    bgcolor: "action.disabledBackground",
    color: "action.disabled",
  },
};

export default function AccountPage() {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // First, verify the current email if not already verified
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          setMessage({
            type: "warning",
            text: "Please verify your current email first. Verification link has been sent.",
          });
          setIsLoading(false);
          return;
        }

        // Send verification to new email
        await verifyBeforeUpdateEmail(user, newEmail);
        setVerificationSent(true);
        setMessage({
          type: "info",
          text: "A verification link has been sent to your new email address. Please verify it to complete the email change.",
        });

        // Set up a listener for email verification
        const unsubscribe = auth.onAuthStateChanged(async (updatedUser) => {
          if (
            updatedUser &&
            updatedUser.email === newEmail &&
            updatedUser.emailVerified
          ) {
            setMessage({
              type: "success",
              text: "Email updated successfully!",
            });
            setNewEmail("");
            setVerificationSent(false);
            unsubscribe();
          }
        });
      }
    } catch (error) {
      console.error("Error updating email:", error);
      let errorMessage = "Failed to update email. Please try again.";

      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please sign out and sign in again to change your email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        setMessage({ type: "success", text: "Password updated successfully!" });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      let errorMessage = "Failed to update password. Please try again.";

      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please sign out and sign in again to change your password.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Account Settings
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Update Email
              </Typography>
              <Box component="form" onSubmit={handleUpdateEmail}>
                <TextField
                  fullWidth
                  label="New Email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={verificationSent || isLoading}
                  sx={{
                    mb: 2,
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
                  type="submit"
                  disabled={!newEmail || isLoading || verificationSent}
                  sx={buttonSx}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : verificationSent ? (
                    "Verification Email Sent"
                  ) : (
                    "Update Email"
                  )}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Box component="form" onSubmit={handleUpdatePassword}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  sx={{
                    mb: 2,
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
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  sx={{
                    mb: 2,
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
                  type="submit"
                  disabled={!newPassword || !confirmPassword || isLoading}
                  sx={buttonSx}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
