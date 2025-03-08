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
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const response = await authService.resetPassword(
        token,
        formData.password
      );
      setSuccess(response.message);
      setFormData({ password: "", confirmPassword: "" });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            Reset Password
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
            Enter your new password below
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
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
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
              <TextField
                required
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
