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

const Login = ({ mode, toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      const response = await authService.login(formData);

      if (!response.access_token) {
        throw new Error("No access token received");
      }

      login(response.user, response.access_token);
      navigate("/tasks");
    } catch (err) {
      setError(err.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "calc(100vh - 40px)", // Subtract the main padding
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
            Task Manager
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              color: "text.secondary",
              fontWeight: theme.typography.subtitle1.fontWeight,
            }}
          >
            Sign in to manage your tasks
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
                autoComplete="current-password"
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
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  underline="hover"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
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
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2,
                  color: "text.secondary",
                }}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  underline="hover"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
