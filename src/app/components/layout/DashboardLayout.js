import { Box, Container } from "@mui/material";
import Navigation from "./Navigation";

export default function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 10, sm: 12 },
          pb: 6,
          px: { xs: 2, sm: 4 },
          overflow: "auto",
          width: "100%",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            mt: 4,
            px: { xs: 1, sm: 2, md: 4 },
            maxWidth: "1800px",
            mx: "auto",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}
