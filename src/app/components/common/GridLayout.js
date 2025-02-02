import { Grid, Box } from "@mui/material";

export default function GridLayout({ children, spacing = 3 }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Grid
        container
        direction="column"
        spacing={spacing}
        sx={{
          mb: 4,
          width: "100%",
        }}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <Grid item key={index} xs={12}>
              {child}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            {children}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

// Helper components for common grid layouts
export function FullWidthGrid({ children }) {
  return (
    <Grid item xs={12} sx={{ width: "100%" }}>
      {children}
    </Grid>
  );
}

export function HalfWidthGrid({ children }) {
  return (
    <Grid
      item
      xs={12}
      lg={6}
      sx={{
        minHeight: { xs: "600px", md: "auto" },
        maxWidth: "100%",
      }}
    >
      {children}
    </Grid>
  );
}

export function ThirdWidthGrid({ children }) {
  return (
    <Grid item xs={12} lg={4}>
      {children}
    </Grid>
  );
}

export function QuarterWidthGrid({ children }) {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      xl={3}
      sx={{
        minWidth: { xs: "100%", sm: "300px" },
        display: "flex",
        justifyContent: "center",
        px: 1, // Add horizontal padding for more even spacing
        "& > *": {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: "300px", // Slightly reduced for better spacing
        },
      }}
    >
      {children}
    </Grid>
  );
}
