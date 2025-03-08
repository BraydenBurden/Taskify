import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Alert,
  Divider,
  IconButton,
  Badge,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profile_picture: user?.profile_picture || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        profile_picture: reader.result,
      });
      setError("");
    };

    reader.onerror = () => {
      setError("Failed to read the image file");
    };

    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      profile_picture: user?.profile_picture || "",
    });
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const requestData = {
        name: formData.name,
        profile_picture: formData.profile_picture || null,
      };

      // Then send the actual PUT request
      const response = await fetch("http://localhost:5000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to update profile"
        );
      }

      updateUser(data.user);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mr: 2,
                bgcolor: formData.profile_picture
                  ? "primary.main"
                  : user?.random_color || "primary.main",
                fontSize: "2rem",
              }}
              src={formData.profile_picture}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {isEditing && (
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                sx={{
                  position: "absolute",
                  bottom: -8,
                  right: 8,
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Badge>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Box>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
          {!isEditing ? (
            <IconButton
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ ml: 2 }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <IconButton color="error" onClick={handleCancel} sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          {isEditing ? (
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              autoFocus
              disabled={isLoading}
            />
          ) : (
            <TextField
              fullWidth
              label="Name"
              value={user?.name || ""}
              margin="normal"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            margin="normal"
            variant="outlined"
            disabled
            helperText="Email cannot be changed"
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          {isEditing && (
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
                sx={{ position: "relative" }}
              >
                {isLoading ? (
                  <>
                    Updating...
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
