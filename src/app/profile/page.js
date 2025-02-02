"use client";

import { useState, useEffect } from "react";
import { auth } from "@/app/backend/firebaseConfig";
import { Box, Container, Typography, Paper, Avatar, Grid } from "@mui/material";
import { Person } from "@mui/icons-material";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <Container>
          <Typography>Please sign in to view your profile.</Typography>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Avatar
              sx={{ width: 100, height: 100, mb: 2, bgcolor: "secondary.main" }}
            >
              <Person sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Account Created
              </Typography>
              <Typography variant="body1">
                {user.metadata.creationTime}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="text.secondary">
                Last Sign In
              </Typography>
              <Typography variant="body1">
                {user.metadata.lastSignInTime}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
