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
  IconButton,
  Link,
  useTheme,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/api";

const SignUp = ({ mode, toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(response.message);
    } catch (err) {
      setError(err.error || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await authService.resendVerification(formData.email);
      setSuccess(response.message);
    } catch (err) {
      setError(
        err.error || "Failed to resend verification email. Please try again."
      );
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
            position: "relative",
            bgcolor: "background.paper",
            transition: theme.transitions.create(["background-color"], {
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.standard,
              }),
            }}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "text.primary",
              fontWeight: theme.typography.h4.fontWeight,
            }}
          >
            Create Account
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: "text.secondary",
              fontWeight: theme.typography.subtitle1.fontWeight,
            }}
          >
            Sign up to start managing your tasks
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: "100%" }}
          >
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  severity="success"
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleResendVerification}
                    >
                      Resend
                    </Button>
                  }
                >
                  {success}
                </Alert>
              )}
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                autoComplete="name"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: theme.transitions.create(["border-color"], {
                      duration: theme.transitions.duration.standard,
                    }),
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:hover": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:focus": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                autoComplete="email"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: theme.transitions.create(["border-color"], {
                      duration: theme.transitions.duration.standard,
                    }),
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:hover": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:focus": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: theme.transitions.create(["border-color"], {
                      duration: theme.transitions.duration.standard,
                    }),
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:hover": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:focus": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                autoComplete="new-password"
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    transition: theme.transitions.create(["border-color"], {
                      duration: theme.transitions.duration.standard,
                    }),
                    "&:-webkit-autofill": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      WebkitTextFillColor: theme.palette.text.primary,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:hover": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
                    "&:-webkit-autofill:focus": {
                      WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset !important`,
                      backgroundColor: `${theme.palette.background.paper} !important`,
                    },
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
                  transition: theme.transitions.create(
                    ["background-color", "box-shadow"],
                    {
                      duration: theme.transitions.duration.standard,
                    }
                  ),
                }}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2,
                  color: "text.secondary",
                }}
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
