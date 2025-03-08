import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BugReportIcon from "@mui/icons-material/BugReport";
import BugReport from "./BugReport";

const Navbar = ({ mode, toggleColorMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
    handleClose();
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={1}
        sx={{
          borderRadius: 0,
          "& .MuiToolbar-root": {
            borderRadius: 0,
          },
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/tasks")}
            >
              Taskify
            </Typography>
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              sx={{
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={() => setBugReportOpen(true)}
                sx={{ mr: 2 }}
                title="Report a Bug"
              >
                <BugReportIcon />
              </IconButton>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.name}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: user.profile_picture
                      ? "secondary.main"
                      : user.random_color || "secondary.main",
                  }}
                  src={user.profile_picture}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <BugReport open={bugReportOpen} onClose={() => setBugReportOpen(false)} />
    </>
  );
};

export default Navbar;
