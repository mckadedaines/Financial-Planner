"use client";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

const AnimatedStatBox = ({ style, title, value, change, color, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      style={{ height: "100%" }}
    >
      <Box sx={style}>
        <Typography
          color="text.secondary"
          variant="body2"
          gutterBottom
          sx={{ mb: 1 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              wordBreak: "break-word",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              fontWeight: 600,
              color: color,
            }}
          >
            {value}
          </Typography>
          {change && (
            <Typography
              variant="body2"
              sx={{
                color: change.startsWith("+") ? "#ef4444" : "#10b981",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {change} from last month
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnimatedStatBox;
