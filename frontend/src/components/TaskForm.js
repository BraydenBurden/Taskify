import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  useTheme,
  Alert,
} from "@mui/material";
import { taskService } from "../services/api";

const TaskForm = ({ onSubmit, onCancel }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
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
      const newTask = await taskService.createTask(formData);
      onSubmit(newTask);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
      });
    } catch (err) {
      setError(err.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        New Task
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          variant="outlined"
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          variant="outlined"
          disabled={loading}
        />
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            label="Priority"
            variant="outlined"
            disabled={loading}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          disabled={loading}
        />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formData.title || loading}
          >
            Add Task
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TaskForm;
