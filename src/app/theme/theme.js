import { createTheme } from "@mui/material/styles";

const greenAccent = "#10b981";

// Common theme settings
const commonThemeSettings = {
  typography: {
    fontFamily: [
      "Roboto",
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
  },
};

// Light theme
export const lightTheme = createTheme({
  ...commonThemeSettings,
  palette: {
    mode: "light",
    primary: {
      main: greenAccent,
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: greenAccent,
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#4B5563",
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  ...commonThemeSettings,
  palette: {
    mode: "dark",
    primary: {
      main: greenAccent,
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: greenAccent,
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#111827",
      paper: "#1F2937",
    },
    text: {
      primary: "#F9FAFB",
      secondary: "#D1D5DB",
    },
  },
});

// Theme context
export const getTheme = (mode) => (mode === "dark" ? darkTheme : lightTheme);
