import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";

function Error() {
  const error = useRouteError();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        textAlign: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "8rem",
            fontWeight: "bold",
            color: "error.main",
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
          {error.statusText || error.message}
        </Typography>
        {error?.stack && (
          <Box
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              textAlign: "left",
              bgcolor: "background.paper",
              p: 2,
              borderRadius: 1,
              mb: 2,
              fontSize: "0.75rem",
            }}
          >
            <strong>Stack Trace:</strong>
            <br />
            {error.stack}
          </Box>
        )}
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 400,
            mx: "auto",
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          Sorry, the page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          sx={{
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          Go Home
        </Button>
      </Paper>
    </Box>
  );
}

export default Error;
