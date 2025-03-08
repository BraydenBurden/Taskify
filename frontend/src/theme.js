import { createTheme } from "@mui/material/styles";

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

// Create and export the theme
const theme = createTheme(getDesignTokens("light")); // Default to light mode

export default theme;
