import React, { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMediaQuery, GlobalStyles } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#ff9800", // Orange
      light: "#ffb74d",
      dark: "#f57c00",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: mode === "light" ? "#f5f5f5" : "#121212",
      paper: mode === "light" ? "#ffffff" : "#1e1e1e",
    },
    text: {
      primary:
        mode === "light" ? "rgba(0, 0, 0, 0.87)" : "rgba(255, 255, 255, 0.87)",
      secondary:
        mode === "light" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 400,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === "light"
              ? "0 4px 6px rgba(0, 0, 0, 0.1)"
              : "0 4px 6px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          "&.MuiButton-contained": {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor:
              mode === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.7)",
          },
        },
      },
    },
  },
});

const AppContent = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode || (prefersDarkMode ? "dark" : "light");
  });
  const location = useLocation();
  const showNavbar = !["/login", "/signup", "/forgot-password"].includes(
    location.pathname
  );

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const currentTheme = useMemo(
    () => createTheme(getDesignTokens(mode)),
    [mode]
  );

  const scrollbarStyles = {
    "*::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "*::-webkit-scrollbar-track": {
      background: mode === "light" ? "#f1f1f1" : "#1e1e1e",
      borderRadius: "4px",
    },
    "*::-webkit-scrollbar-thumb": {
      background: mode === "light" ? "#888" : "#666",
      borderRadius: "4px",
      "&:hover": {
        background: mode === "light" ? "#666" : "#888",
      },
    },
    "*::-webkit-scrollbar-corner": {
      background: mode === "light" ? "#f1f1f1" : "#1e1e1e",
    },
  };

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <GlobalStyles styles={scrollbarStyles} />
      <AuthProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
          role="application"
        >
          {showNavbar && (
            <header>
              <Navbar mode={mode} toggleColorMode={toggleColorMode} />
            </header>
          )}
          <main
            style={{
              flex: 1,
              padding: "20px",
              outline: "none",
            }}
            tabIndex="-1"
            role="main"
          >
            <Routes>
              <Route
                path="/login"
                element={
                  <Login mode={mode} toggleColorMode={toggleColorMode} />
                }
              />
              <Route
                path="/signup"
                element={
                  <SignUp mode={mode} toggleColorMode={toggleColorMode} />
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <div role="region" aria-label="Task Management">
                      <TaskList mode={mode} toggleColorMode={toggleColorMode} />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <div role="region" aria-label="User Profile">
                      <Profile />
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/"
                element={
                  <LandingPage mode={mode} toggleColorMode={toggleColorMode} />
                }
              />
              <Route
                path="/verify-email/:token"
                element={<EmailVerification />}
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
