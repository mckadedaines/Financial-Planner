"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebaseConfig";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Fade,
} from "@mui/material";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import CanvasBackground from "@/app/components/CanvasBackground";
import Card from "@/app/components/common/Card";

// Cache for verified users
const verifiedUsers = new Set();

export default function withEmailVerification(WrappedComponent) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [mounted, setMounted] = useState(false);

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

    const cardStyles = {
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

    // Set mounted after initial render
    useEffect(() => {
      setMounted(true);
    }, []);

    const checkVerificationStatus = async (user) => {
      try {
        if (!user) return false;

        // If user is already in verified cache, return true immediately
        if (verifiedUsers.has(user.uid)) {
          setIsVerified(true);
          return true;
        }

        await user.reload();
        const verified = user.emailVerified;

        if (verified) {
          verifiedUsers.add(user.uid); // Add to cache if verified
          setMessage("Email verified!");
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }

        return verified;
      } catch (error) {
        console.error("Error checking verification status:", error);
        return false;
      }
    };

    useEffect(() => {
      let loadingTimeout;

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push("/");
          return;
        }

        setIsLoading(true);
        // Only show loading indicator if verification check takes more than 500ms
        loadingTimeout = setTimeout(() => {
          setShowLoading(true);
        }, 500);

        await checkVerificationStatus(user);

        clearTimeout(loadingTimeout);
        setIsLoading(false);
        setShowLoading(false);
      });

      return () => {
        unsubscribe();
        if (loadingTimeout) clearTimeout(loadingTimeout);
      };
    }, [router]);

    const handleResendVerification = async () => {
      try {
        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser);
          setMessage("Verification email sent! Please check your inbox.");
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
        setMessage("Error sending verification email. Please try again.");
      }
    };

    // If user is verified (either from cache or check), render component immediately
    if (isVerified) {
      return <WrappedComponent {...props} />;
    }

    // Base container that's always present
    const BaseContainer = ({ children }) => (
      <Box
        sx={{
          ...containerStyles,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "background.default",
        }}
      >
        <CanvasBackground />
        <Fade in={true} timeout={300}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight: "100vh",
              p: { xs: 2, sm: 4 },
            }}
          >
            {children}
          </Box>
        </Fade>
      </Box>
    );

    // Don't render anything until mounted
    if (!mounted) {
      return (
        <BaseContainer>
          <CircularProgress />
        </BaseContainer>
      );
    }

    // Show loading only if it's taking longer than the timeout
    if (isLoading && showLoading) {
      return (
        <BaseContainer>
          <CircularProgress />
        </BaseContainer>
      );
    }

    // Show verification required screen
    if (!isVerified) {
      return (
        <BaseContainer>
          <Card sx={{ ...cardStyles, my: "auto" }}>
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
                Email Verification Required
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please verify your email address to access this page. Check your
                inbox for the verification link.
              </Typography>
              {message && (
                <Typography
                  variant="body2"
                  color={message.includes("Error") ? "error" : "success.main"}
                  sx={{ mb: 2 }}
                >
                  {message}
                </Typography>
              )}
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleResendVerification}
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
                  Resend Verification Email
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => checkVerificationStatus(auth.currentUser)}
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
                  I've Verified My Email
                </Button>
              </Stack>
            </Box>
          </Card>
        </BaseContainer>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
