import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SyncIcon from "@mui/icons-material/Sync";
import GroupIcon from "@mui/icons-material/Group";

// Decorative SVG patterns
const ModernGridPattern = () => {
  const theme = useTheme();
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", top: 0, left: 0, opacity: 0.2 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="modern-grid"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* Vertical lines */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="0"
            x2="100"
            y2="100"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          {/* Horizontal lines */}
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="100"
            x2="100"
            y2="100"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          {/* Diagonal lines */}
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
          />
          {/* Center point */}
          <circle cx="50" cy="50" r="1" fill={theme.palette.primary.main} />
          {/* Corner accents */}
          <path
            d="M0 0 L10 0 L0 10 Z"
            fill={theme.palette.primary.main}
            opacity="0.5"
          />
          <path
            d="M100 0 L90 0 L100 10 Z"
            fill={theme.palette.primary.main}
            opacity="0.5"
          />
          <path
            d="M0 100 L10 100 L0 90 Z"
            fill={theme.palette.primary.main}
            opacity="0.5"
          />
          <path
            d="M100 100 L90 100 L100 90 Z"
            fill={theme.palette.primary.main}
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modern-grid)" />
    </svg>
  );
};

const BottomPattern = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity: isDarkMode ? 0.3 : 0.15,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="bottom-pattern"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          {/* Concentric circles */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="20"
            stroke={theme.palette.primary.main}
            strokeWidth="1"
            fill="none"
          />

          {/* Corner gradients */}
          <defs>
            <linearGradient
              id="corner-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={theme.palette.primary.main}
                stopOpacity={isDarkMode ? "0.5" : "0.3"}
              />
              <stop
                offset="100%"
                stopColor={theme.palette.primary.main}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Corner accents */}
          <path d="M0 0 L50 0 L0 50 Z" fill="url(#corner-gradient)" />
          <path d="M200 0 L150 0 L200 50 Z" fill="url(#corner-gradient)" />
          <path d="M0 200 L50 200 L0 150 Z" fill="url(#corner-gradient)" />
          <path d="M200 200 L150 200 L200 150 Z" fill="url(#corner-gradient)" />

          {/* Dots pattern */}
          <circle cx="100" cy="100" r="1" fill={theme.palette.primary.main} />
          <circle cx="50" cy="50" r="1" fill={theme.palette.primary.main} />
          <circle cx="150" cy="50" r="1" fill={theme.palette.primary.main} />
          <circle cx="50" cy="150" r="1" fill={theme.palette.primary.main} />
          <circle cx="150" cy="150" r="1" fill={theme.palette.primary.main} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bottom-pattern)" />
    </svg>
  );
};

const WavePattern = () => (
  <svg
    width="100%"
    height="100%"
    style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.05 }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill="currentColor"
      d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
);

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.standard,
        }),
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.primary.dark}10)`,
          opacity: 0,
          transition: theme.transitions.create("opacity", {
            duration: theme.transitions.duration.standard,
          }),
        },
        "&:hover::before": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ position: "relative", zIndex: 1 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ position: "relative", zIndex: 1 }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

const LandingPage = ({ mode, toggleColorMode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Lightning Fast",
      description:
        "Organize your tasks quickly and efficiently with our intuitive interface.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure & Private",
      description:
        "Your tasks are encrypted and stored securely. Your privacy is our priority.",
    },
    {
      icon: <SyncIcon sx={{ fontSize: 40 }} />,
      title: "Real-time Sync",
      description:
        "Access your tasks from any device. Changes sync instantly across all platforms.",
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: "Team Ready",
      description: "Share tasks with team members and collaborate seamlessly.",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <ModernGridPattern />

      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: theme.transitions.create(
            ["background-color", "box-shadow"],
            {
              duration: theme.transitions.duration.standard,
            }
          ),
          backdropFilter: "blur(12px)",
          backgroundColor:
            mode === "dark"
              ? "rgba(30, 30, 30, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          borderBottom: `1px solid ${
            mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
          }`,
          boxShadow:
            mode === "dark"
              ? "0 4px 20px rgba(0, 0, 0, 0.2)"
              : "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: "text",
                textFillColor: "transparent",
              }}
            >
              Taskify
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.standard,
                  }),
                  "&:hover": {
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  mr: 1,
                  borderColor:
                    mode === "dark"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.2)",
                  color: mode === "dark" ? "white" : "inherit",
                  "&:hover": {
                    borderColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(0, 0, 0, 0.4)",
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 15, sm: 20 },
          pb: { xs: 8, sm: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at center, ${theme.palette.primary.main}20, transparent 70%)`,
            opacity: 0.5,
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              mb: 3,
            }}
          >
            Organize Your Life, One Task at a Time
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            The smart way to manage your tasks, boost productivity, and achieve
            your goals.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signup")}
            sx={{ mr: 2 }}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <WavePattern />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Why Choose Taskify?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          position: "relative",
          overflow: "hidden",
          bgcolor: mode === "dark" ? "#282828" : "background.default",
        }}
      >
        <BottomPattern />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              mode === "dark"
                ? `linear-gradient(135deg, rgba(40, 40, 40, 0.7), rgba(60, 60, 60, 0.7))`
                : `linear-gradient(135deg, ${theme.palette.primary.main}05, ${theme.palette.primary.dark}05)`,
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: "center",
              bgcolor: "primary.main",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                opacity: 0.9,
                zIndex: 0,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of users who are already organizing their tasks
                with Taskify.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/signup")}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                Start Free Trial
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
