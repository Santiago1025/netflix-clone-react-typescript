import React from "react";
import { Box, CircularProgress } from "@mui/material";

const NetflixLoadingSpinner: React.FC = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      bgcolor: "black",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress
      size={80}
      thickness={4.5}
      sx={{ color: "#e50914" }}
    />
  </Box>
);

export default NetflixLoadingSpinner;
