import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Alert,
  Link,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { authService } from "../services/api";

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email) {
        setError("Please enter your email address");
        return;
      }

      const response = await authService.requestPasswordReset(email);
      setSuccess(response.message);
      setEmail("");
    } catch (err) {
      setError(err.error || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "calc(100vh - 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: theme.typography.h4.fontWeight,
            }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: "text.secondary",
              textAlign: "center",
              maxWidth: "400px",
              mb: 3,
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: theme.transitions.create(["border-color"], {
                      duration: theme.transitions.duration.standard,
                    }),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: "text.secondary",
                }}
              >
                Remember your password?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Back to Login
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
