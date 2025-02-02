import { Paper, Box, Typography, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export default function Card({
  title,
  subtitle,
  children,
  action,
  noPadding = false,
  elevation = 0,
  sx = {},
}) {
  return (
    <Paper
      elevation={elevation}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: subtitle ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="h2" gutterBottom={!!subtitle}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <IconButton size="small" color="inherit">
              <MoreVert />
            </IconButton>
          )}
        </Box>
      )}
      <Box
        sx={{
          p: noPadding ? 0 : 2,
          height: title || subtitle ? "calc(100% - 64px)" : "100%",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
