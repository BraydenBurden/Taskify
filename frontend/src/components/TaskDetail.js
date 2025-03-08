import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Divider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { taskService } from "../services/api";

const TaskDetail = ({
  task,
  onClose,
  onToggleComplete,
  onEdit,
  isEditing: initialIsEditing,
  onCancel,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editedTask, setEditedTask] = useState(task);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const subtasksListRef = useRef(null);

  useEffect(() => {
    setEditedTask(task);
    setIsEditing(initialIsEditing);
  }, [task, initialIsEditing]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getProgressColor = (progress) => {
    // Red: #ff1744
    // Yellow: #ffd700
    // Green: #00e676

    if (progress < 50) {
      // Transition from red to yellow (0-49%)
      const ratio = progress / 50;
      const r = Math.round(255 - (255 - 255) * ratio); // Red stays 255
      const g = Math.round(215 * ratio); // Green increases to 215 (yellow)
      const b = Math.round((0 + 0) * ratio); // Blue stays 0
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Transition from yellow to green (50-100%)
      const ratio = (progress - 50) / 50;
      const r = Math.round(255 - 255 * ratio); // Red decreases from 255
      const g = Math.round(215 + (230 - 215) * ratio); // Green increases from 215 to 230
      const b = Math.round(0 + 118 * ratio); // Blue increases to 118
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (task.id) {
        await onEdit(editedTask);
      } else {
        const newTask = {
          ...editedTask,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await onEdit(newTask);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task);
    onCancel();
  };

  const scrollToBottom = () => {
    if (subtasksListRef.current) {
      const scrollHeight = subtasksListRef.current.scrollHeight;
      const height = subtasksListRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      subtasksListRef.current.scrollTop = maxScrollTop;
    }
  };

  useEffect(() => {
    if (editedTask.subtasks?.length > 0) {
      scrollToBottom();
    }
  }, [editedTask.subtasks]);

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      const subtaskData = {
        title: newSubtask.trim(),
      };

      // If this is a new task (no ID yet), add the subtask to the local state
      if (!task.id) {
        const newSubtask = {
          id: Date.now(), // Temporary ID for new tasks
          title: subtaskData.title,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setEditedTask((prev) => ({
          ...prev,
          subtasks: [...(prev.subtasks || []), newSubtask],
        }));
      } else {
        // For existing tasks, make the API call
        const newSubtask = await taskService.addSubtask(task.id, subtaskData);
        setEditedTask((prev) => ({
          ...prev,
          subtasks: [...(prev.subtasks || []), newSubtask],
        }));
      }

      setNewSubtask("");
      scrollToBottom();
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error("Failed to add subtask:", err);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const subtask = editedTask.subtasks.find((s) => s.id === subtaskId);
      const updatedSubtask = await taskService.updateSubtask(
        task.id,
        subtaskId,
        {
          completed: !subtask.completed,
        }
      );
      setEditedTask((prev) => ({
        ...prev,
        subtasks: (prev.subtasks || []).map((s) =>
          s.id === subtaskId ? updatedSubtask : s
        ),
      }));
    } catch (err) {
      console.error("Failed to update subtask:", err);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await taskService.deleteSubtask(task.id, subtaskId);
      setEditedTask((prev) => ({
        ...prev,
        subtasks: (prev.subtasks || []).filter((s) => s.id !== subtaskId),
      }));
    } catch (err) {
      console.error("Failed to delete subtask:", err);
    }
  };

  const calculateProgress = () => {
    if (!editedTask.subtasks?.length) return 0;
    const completedSubtasks = editedTask.subtasks.filter(
      (subtask) => subtask.completed
    ).length;
    return (completedSubtasks / editedTask.subtasks.length) * 100;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 2 }}>
          <IconButton onClick={() => onToggleComplete(task.id)} size="large">
            {task.completed ? (
              <CheckCircleIcon color="success" fontSize="large" />
            ) : (
              <RadioButtonUncheckedIcon fontSize="large" />
            )}
          </IconButton>
          {isEditing ? (
            <TextField
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              variant="outlined"
              label="Title"
              fullWidth
              size="medium"
            />
          ) : (
            <Typography variant="h5" component="h2">
              {task.title}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                startIcon={
                  isSaving ? <CircularProgress size={20} /> : <SaveIcon />
                }
                onClick={handleSave}
                color="primary"
                size="medium"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </>
          ) : (
            <IconButton onClick={() => setIsEditing(true)} size="small">
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} size="small" disabled={isSaving}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {editedTask.subtasks?.length > 0 && !isEditing && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress:
            </Typography>
            <Typography variant="body2" color="text.primary">
              {Math.round(calculateProgress())}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateProgress()}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: (theme) =>
                  getProgressColor(calculateProgress()),
                transition:
                  "transform 0.4s linear, background-color 0.4s linear",
              },
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <Box>
          {isEditing ? (
            <FormControl fullWidth size="medium">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={editedTask.priority}
                onChange={handleChange}
                label="Priority"
                variant="outlined"
                sx={{
                  "& .MuiSelect-select": {
                    color:
                      editedTask.priority === "high"
                        ? theme.palette.error.main
                        : editedTask.priority === "medium"
                        ? "#FFD700"
                        : theme.palette.success.main,
                  },
                }}
              >
                <MenuItem
                  value="low"
                  sx={{
                    color: theme.palette.success.main,
                    "&.Mui-selected": {
                      backgroundColor: `${theme.palette.success.main}20`,
                      color: theme.palette.success.main,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: `${theme.palette.success.main}30`,
                    },
                  }}
                >
                  Low
                </MenuItem>
                <MenuItem
                  value="medium"
                  sx={{
                    color: "#FFD700",
                    "&.Mui-selected": {
                      backgroundColor: "#FFD70020",
                      color: "#FFD700",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "#FFD70030",
                    },
                  }}
                >
                  Medium
                </MenuItem>
                <MenuItem
                  value="high"
                  sx={{
                    color: theme.palette.error.main,
                    "&.Mui-selected": {
                      backgroundColor: `${theme.palette.error.main}20`,
                      color: theme.palette.error.main,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: `${theme.palette.error.main}30`,
                    },
                  }}
                >
                  High
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              sx={{
                textTransform: "capitalize",
                "& .MuiChip-label": {
                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                },
                ...(task.priority === "medium" && {
                  backgroundColor: "#FFD700",
                  "& .MuiChip-label": {
                    color: "#000",
                  },
                }),
              }}
            />
          )}
        </Box>

        <Box>
          {isEditing ? (
            <TextField
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              label="Description"
            />
          ) : (
            <Typography variant="body1">
              {task.description || "No description provided"}
            </Typography>
          )}
        </Box>

        <Box>
          {isEditing ? (
            <TextField
              name="due_date"
              type="date"
              value={editedTask.due_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              label="Due Date"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <Typography variant="body1">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        {!isEditing && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Subtasks
            </Typography>
            {editedTask.subtasks?.length > 0 && (
              <LinearProgress
                variant="determinate"
                value={calculateProgress()}
                sx={{ mb: 2 }}
              />
            )}
            <List
              ref={subtasksListRef}
              sx={{
                maxHeight: "300px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background:
                    theme.palette.mode === "light" ? "#f1f1f1" : "#1e1e1e",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.mode === "light" ? "#888" : "#666",
                  borderRadius: "4px",
                  "&:hover": {
                    background:
                      theme.palette.mode === "light" ? "#666" : "#888",
                  },
                },
              }}
            >
              {editedTask.subtasks?.map((subtask) => (
                <ListItem
                  key={subtask.id}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <IconButton
                    edge="start"
                    onClick={() => handleToggleSubtask(subtask.id)}
                    sx={{ mr: 2 }}
                  >
                    {subtask.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                  <ListItemText
                    primary={subtask.title}
                    sx={{
                      textDecoration: subtask.completed
                        ? "line-through"
                        : "none",
                      color: subtask.completed
                        ? "text.secondary"
                        : "text.primary",
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add new subtask"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddSubtask}
                disabled={!newSubtask.trim()}
              >
                Add
              </Button>
            </Box>
          </Box>
        )}

        <Box>
          <Typography
            variant="body1"
            color={task.completed ? "success.main" : "text.primary"}
          >
            {task.completed ? "Completed" : "In Progress"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskDetail;
