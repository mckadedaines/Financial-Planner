"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import DashboardLayout from "@/app/components/layout/DashboardLayout";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    budgetAlerts: true,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Box sx={{ mt: 4 }}>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive email updates about your account"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Budget Alerts"
                  secondary="Get notified when approaching budget limits"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.budgetAlerts}
                    onChange={() => handleToggle("budgetAlerts")}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
}
