import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";

const BugReport = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    steps: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/bugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit bug report");
      }

      setSuccess("Bug report submitted successfully");
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        steps: "",
      });

      // Close the modal after 2 seconds on success
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit bug report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      aria-labelledby="bug-report-title"
      disableEscapeKeyDown={isLoading}
      keepMounted={false}
      TransitionProps={{
        onExited: () => {
          // Reset form state when dialog is fully closed
          setFormData({
            title: "",
            description: "",
            severity: "medium",
            steps: "",
          });
          setError("");
          setSuccess("");
        },
      }}
      slotProps={{
        backdrop: {
          // Prevent backdrop from using aria-hidden
          "aria-hidden": undefined,
        },
      }}
      // Ensure proper focus management
      disableEnforceFocus
      disableAutoFocus
    >
      <DialogTitle
        id="bug-report-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <BugReportIcon color="error" />
        Report a Bug
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent tabIndex={-1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            role="presentation"
          >
            <TextField
              name="title"
              label="Bug Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              disabled={isLoading}
              placeholder="Brief description of the issue"
              autoFocus
              inputProps={{
                "aria-label": "Bug title",
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="severity-label">Severity</InputLabel>
              <Select
                labelId="severity-label"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                label="Severity"
                disabled={isLoading}
                inputProps={{
                  "aria-label": "Bug severity",
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="description"
              label="Detailed Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              disabled={isLoading}
              placeholder="Please provide a detailed description of the bug"
              inputProps={{
                "aria-label": "Bug description",
              }}
            />

            <TextField
              name="steps"
              label="Steps to Reproduce"
              value={formData.steps}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
              disabled={isLoading}
              placeholder="1. First step&#10;2. Second step&#10;3. ..."
              inputProps={{
                "aria-label": "Steps to reproduce",
              }}
            />

            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" role="alert">
                {success}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cancel bug report"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ position: "relative" }}
            aria-label="Submit bug report"
          >
            {isLoading ? (
              <>
                Submitting...
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                  aria-label="Submitting bug report"
                />
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BugReport;
