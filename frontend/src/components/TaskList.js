import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Paper,
  useTheme,
  Modal,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TaskDetail from "./TaskDetail";
import { taskService } from "../services/api";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "80%", md: "70%" },
  maxWidth: "800px",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  maxHeight: "90vh",
  overflow: "auto",
  "& .MuiTextField-root": {
    width: "100%",
  },
  "& .MuiPaper-root": {
    bgcolor: "background.paper",
  },
};

const TaskList = () => {
  const theme = useTheme();
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandTask, setExpandTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newSubtask, setNewSubtask] = useState("");
  const [taskFilter, setTaskFilter] = useState("ongoing");
  const [subtaskFilter, setSubtaskFilter] = useState("ongoing");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mountStarted, setMountStarted] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!loading) {
      // First set mountStarted to true to ensure initial hidden state
      setMountStarted(true);
      // Then trigger the actual mount after a frame to ensure hidden state is applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMounted(true);
        });
      });
    }
  }, [loading]);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      console.log(data);
      setTasks(data);
      setError("");
    } catch (err) {
      setError(err.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtasks = async (taskId) => {
    try {
      const response = await taskService.getSubtasks(taskId);
      setSubtasks(response);
    } catch (err) {
      console.error("Failed to fetch subtasks:", err);
      setError("Failed to fetch subtasks: " + err.message);
    }
  };

  const onOpenForm = () => {
    setSelectedTask({
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      status: "pending",
    });
    setIsEditing(true);
  };

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

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      setError(err.error || "Failed to update task status");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      // Set the deleting task ID to show the spinner
      setDeletingTaskId(taskId);

      await taskService.deleteTask(taskId);

      // If the deleted task is currently expanded, close it
      if (expandTask && expandTask.id === taskId) {
        setExpandTask(false);
        setSubtasks([]);
        setIsTransitioning(false);
      }

      // Reset any related states
      setSelectedTask(null);
      setIsEditing(false);

      // Fetch fresh tasks after deletion
      await fetchTasks();
    } catch (err) {
      setError(err.error || "Failed to delete task");
    } finally {
      // Clear the deleting task ID
      setDeletingTaskId(null);
    }
  };

  const handleEdit = async (editedTask) => {
    try {
      let updatedTask;
      if (editedTask.id) {
        // Update existing task
        updatedTask = await taskService.updateTask(editedTask.id, editedTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      } else {
        // Create new task
        updatedTask = await taskService.createTask(editedTask);
        setTasks((prevTasks) => [...prevTasks, updatedTask]);
      }
      setSelectedTask(null);
      setIsEditing(false);
      return updatedTask; // Return the updated task
    } catch (err) {
      setError(err.error || "Failed to save task");
      throw err; // Re-throw the error to be caught by the caller
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
  };

  const handleDetailsClick = async (e, task) => {
    e.stopPropagation();
    if (!expandTask) {
      // Opening a task - use cached data
      setExpandTask(task);
      setSubtaskFilter("ongoing");
      setSubtasks(task.subtasks || []);
    } else {
      // Closing a task - start transition first
      setIsTransitioning(true);

      requestAnimationFrame(() => {
        setTimeout(() => {
          // First complete the transition
          setExpandTask(false);
          setSubtasks([]);
          setIsTransitioning(false);

          // Then fetch fresh data after transition is done
          taskService
            .getTasks()
            .then((data) => {
              setTasks(data);
            })
            .catch((err) => {
              console.error("Failed to refresh tasks:", err);
            });
        }, 200);
      });
    }
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const subtask = subtasks.find((s) => s.id === subtaskId);
      const updatedSubtask = await taskService.updateSubtask(
        expandTask.id,
        subtaskId,
        { completed: !subtask.completed }
      );

      // Update subtasks state
      setSubtasks((prev) =>
        prev.map((s) => (s.id === subtaskId ? updatedSubtask : s))
      );

      // Update the task in the tasks list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === expandTask.id
            ? {
                ...task,
                subtasks: task.subtasks.map((s) =>
                  s.id === subtaskId ? updatedSubtask : s
                ),
              }
            : task
        )
      );
    } catch (err) {
      console.error("Failed to update subtask:", err);
      setError("Failed to update subtask: " + err.message);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await taskService.deleteSubtask(expandTask.id, subtaskId);

      // Update subtasks state
      setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));

      // Update the task in the tasks list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === expandTask.id
            ? {
                ...task,
                subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
              }
            : task
        )
      );
    } catch (err) {
      console.error("Failed to delete subtask:", err);
      setError("Failed to delete subtask: " + err.message);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      const subtaskData = {
        title: newSubtask.trim(),
      };

      const newSubtaskItem = await taskService.addSubtask(
        expandTask.id,
        subtaskData
      );

      // Update subtasks state
      setSubtasks((prev) => [...prev, newSubtaskItem]);

      // Update the task in the tasks list to include the new subtask
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === expandTask.id
            ? {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtaskItem],
              }
            : task
        )
      );

      // Clear the input
      setNewSubtask("");

      // Set filter to show all subtasks when adding a new one
      setSubtaskFilter("all");
    } catch (err) {
      setError("Failed to add subtask: " + err.message);
    }
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setTaskFilter(newFilter);
    }
  };

  const handlePriorityFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setPriorityFilter(newFilter);
    }
  };

  const getFilteredTasks = () => {
    // Create a new array with all tasks
    let filteredTasks = [...tasks];

    // First filter by status
    switch (taskFilter) {
      case "completed":
        filteredTasks = filteredTasks.filter(
          (task) => task.status === "completed"
        );
        break;
      case "ongoing":
        filteredTasks = filteredTasks.filter(
          (task) => task.status !== "completed"
        );
        break;
      case "all":
        break;
      default:
        filteredTasks = filteredTasks.filter(
          (task) => task.status !== "completed"
        );
        break;
    }

    // Then filter by priority
    if (priorityFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    // Ensure each task has a valid string ID
    return filteredTasks.map((task) => ({
      ...task,
      id: String(task.id),
    }));
  };

  const handleSubtaskFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setSubtaskFilter(newFilter);
    }
  };

  const getFilteredSubtasks = () => {
    switch (subtaskFilter) {
      case "completed":
        return subtasks.filter((subtask) => subtask.completed);
      case "ongoing":
        return subtasks.filter((subtask) => !subtask.completed);
      default:
        return subtasks;
    }
  };

  const getTaskProgress = (task) => {
    // If task is expanded, calculate progress based on current subtasks state
    if (expandTask && expandTask.id === task.id && subtasks.length > 0) {
      return Math.round(
        (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
      );
    }
    // If task is not expanded or has no subtasks, return completion status
    return task.status === "completed" ? 100 : 0;
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

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        height: "calc(100vh - 105px)",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tasks.length > 0 ? (
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            opacity: !mounted ? 0 : expandTask ? 0 : 1,
            visibility:
              !mountStarted || !mounted || expandTask ? "hidden" : "visible",
            transform: !mounted
              ? "scale(0.95) translateY(20px)"
              : expandTask
              ? "translateY(-20px)"
              : "translateY(0)",
            transition: mounted
              ? "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
            maxHeight: expandTask ? "0" : "100px",
            marginBottom: expandTask ? 0 : "8px",
            overflow: "hidden",
            pointerEvents: expandTask ? "none" : "auto",
            position: "relative",
            zIndex: expandTask ? 0 : 1,
            transformOrigin: "center top",
            willChange: "transform, opacity, visibility",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onOpenForm}
            sx={{ height: 40 }}
          >
            Create Task
          </Button>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Paper
              elevation={2}
              sx={{
                p: 0.5,
                bgcolor: "background.default",
                borderRadius: 2,
              }}
            >
              <ToggleButtonGroup
                value={taskFilter}
                exclusive
                onChange={handleFilterChange}
                aria-label="task filter"
                size="small"
              >
                <ToggleButton
                  value="ongoing"
                  aria-label="ongoing tasks"
                  sx={{
                    px: 3,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                  }}
                >
                  Ongoing
                </ToggleButton>
                <ToggleButton
                  value="completed"
                  aria-label="completed tasks"
                  sx={{
                    px: 3,
                    "&.Mui-selected": {
                      bgcolor: "success.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "success.dark",
                      },
                    },
                  }}
                >
                  Completed
                </ToggleButton>
                <ToggleButton
                  value="all"
                  aria-label="all tasks"
                  sx={{
                    px: 3,
                    "&.Mui-selected": {
                      bgcolor: "grey.700",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "grey.800",
                      },
                    },
                  }}
                >
                  All
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: 0.5,
                bgcolor: "background.default",
                borderRadius: 2,
              }}
            >
              <ToggleButtonGroup
                value={priorityFilter}
                exclusive
                onChange={handlePriorityFilterChange}
                aria-label="priority filter"
                size="small"
              >
                <ToggleButton
                  value="high"
                  aria-label="high priority"
                  sx={{
                    px: 3,
                    color: theme.palette.error.main,
                    "&.Mui-selected": {
                      bgcolor: `${theme.palette.error.main}20`,
                      color: theme.palette.error.main,
                      "&:hover": {
                        bgcolor: `${theme.palette.error.main}30`,
                      },
                    },
                  }}
                >
                  High
                </ToggleButton>
                <ToggleButton
                  value="medium"
                  aria-label="medium priority"
                  sx={{
                    px: 3,
                    color: "#FFD700",
                    "&.Mui-selected": {
                      bgcolor: "#FFD70020",
                      color: "#FFD700",
                      "&:hover": {
                        bgcolor: "#FFD70030",
                      },
                    },
                  }}
                >
                  Medium
                </ToggleButton>
                <ToggleButton
                  value="low"
                  aria-label="low priority"
                  sx={{
                    px: 3,
                    color: theme.palette.success.main,
                    "&.Mui-selected": {
                      bgcolor: `${theme.palette.success.main}20`,
                      color: theme.palette.success.main,
                      "&:hover": {
                        bgcolor: `${theme.palette.success.main}30`,
                      },
                    },
                  }}
                >
                  Low
                </ToggleButton>
                <ToggleButton
                  value="all"
                  aria-label="all priorities"
                  sx={{
                    px: 3,
                    "&.Mui-selected": {
                      bgcolor: "grey.700",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "grey.800",
                      },
                    },
                  }}
                >
                  All
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Welcome to your Task Manager!
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Get started by creating your first task.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onOpenForm}
          >
            Create Task
          </Button>
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflow: expandTask ? "hidden" : "auto",
          maxWidth: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: "16px",
            padding: "16px",
            minHeight: "100px",
            width: "100%",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {getFilteredTasks().map((task) => (
            <Card
              key={task.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                gridColumn: "auto",
                width:
                  expandTask && expandTask.id === task.id ? "100%" : "100%",
                height:
                  expandTask && expandTask.id === task.id ? "575px" : "auto",
                maxHeight:
                  expandTask && expandTask.id === task.id ? "575px" : "300px",
                zIndex: expandTask && expandTask.id === task.id ? 10 : 1,
                transition: mounted
                  ? "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
                transform: !mounted
                  ? "scale(0.95) translateY(20px)"
                  : isTransitioning && expandTask.id === task.id
                  ? "scale(0.98) translateY(10px)"
                  : expandTask && expandTask.id !== task.id
                  ? "scale(0.98) translateY(10px)"
                  : "scale(1) translateY(0)",
                transformOrigin: "center top",
                opacity: !mounted
                  ? 0
                  : isTransitioning && expandTask.id === task.id
                  ? 0
                  : expandTask && expandTask.id !== task.id
                  ? 0
                  : 1,
                visibility:
                  !mountStarted ||
                  !mounted ||
                  (expandTask && expandTask.id !== task.id) ||
                  (isTransitioning && expandTask.id === task.id)
                    ? "hidden"
                    : "visible",
                overflow:
                  expandTask && expandTask.id === task.id ? "hidden" : "auto",
                gridArea:
                  expandTask && expandTask.id === task.id
                    ? "1 / 1 / 2 / -1"
                    : "auto",
                margin:
                  expandTask && expandTask.id === task.id ? "0" : undefined,
                willChange: "transform, opacity, visibility, max-height",
                "&:hover": {
                  boxShadow: expandTask ? "none" : 6,
                  transform:
                    !expandTask && mounted && "scale(1.02) translateY(-2px)",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            >
              {expandTask && expandTask.id === task.id ? (
                // Expanded view
                <>
                  <CardContent
                    sx={{
                      pt: 2,
                      px: 3,
                      pb: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        opacity: 1,
                        transform: "translateY(0)",
                        transition:
                          "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => handleToggleComplete(task.id)}
                          size="large"
                        >
                          {task.status === "completed" ? (
                            <CheckCircleIcon color="success" fontSize="large" />
                          ) : (
                            <RadioButtonUncheckedIcon fontSize="large" />
                          )}
                        </IconButton>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ flex: 1 }}
                        >
                          {task.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Priority:
                          </Typography>
                          <Chip
                            label={task.priority}
                            color={getPriorityColor(task.priority)}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              ...(task.priority === "medium" && {
                                backgroundColor: "#FFD700",
                                "& .MuiChip-label": {
                                  color: "#000",
                                },
                              }),
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Description:
                          </Typography>
                          <Typography variant="body1">
                            {task.description || "No description provided"}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Due Date:
                          </Typography>
                          <Typography variant="body1">
                            {task.due_date
                              ? new Date(task.due_date).toLocaleDateString()
                              : "No due date"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">Subtasks</Typography>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 0.5,
                            bgcolor: "background.default",
                            borderRadius: 2,
                          }}
                        >
                          <ToggleButtonGroup
                            value={subtaskFilter}
                            exclusive
                            onChange={handleSubtaskFilterChange}
                            aria-label="subtask filter"
                            size="small"
                          >
                            <ToggleButton
                              value="ongoing"
                              aria-label="ongoing subtasks"
                              sx={{
                                px: 2,
                                "&.Mui-selected": {
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  "&:hover": {
                                    bgcolor: "primary.dark",
                                  },
                                },
                              }}
                            >
                              Ongoing
                            </ToggleButton>
                            <ToggleButton
                              value="completed"
                              aria-label="completed subtasks"
                              sx={{
                                px: 2,
                                "&.Mui-selected": {
                                  bgcolor: "success.main",
                                  color: "primary.contrastText",
                                  "&:hover": {
                                    bgcolor: "success.dark",
                                  },
                                },
                              }}
                            >
                              Completed
                            </ToggleButton>
                            <ToggleButton
                              value="all"
                              aria-label="all subtasks"
                              sx={{
                                px: 2,
                                "&.Mui-selected": {
                                  bgcolor: "grey.700",
                                  color: "primary.contrastText",
                                  "&:hover": {
                                    bgcolor: "grey.800",
                                  },
                                },
                              }}
                            >
                              All
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Paper>
                      </Box>

                      {task.subtasks?.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Overall Progress:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              {getTaskProgress(task)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={getTaskProgress(task)}
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
                                  getProgressColor(getTaskProgress(task)),
                                transition:
                                  "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                              },
                            }}
                          />
                        </Box>
                      )}

                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Add new subtask"
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddSubtask();
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleAddSubtask}
                          disabled={!newSubtask.trim()}
                          startIcon={<AddIcon />}
                        >
                          Add
                        </Button>
                      </Box>

                      <List
                        sx={{
                          flex: 1,
                          maxHeight: "280px",
                          overflow: "auto",
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(auto-fill, minmax(250px, 1fr))",
                          },
                          gridAutoRows: "min-content",
                          gap: 1,
                          p: 1,
                          opacity:
                            expandTask && expandTask.id === task.id ? 1 : 0,
                          transform:
                            expandTask && expandTask.id === task.id
                              ? "translateY(0)"
                              : "translateY(20px)",
                          transition:
                            "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                          "& > *": {
                            minWidth: 0,
                            height: "min-content",
                          },
                        }}
                      >
                        {getFilteredSubtasks().map((subtask) => (
                          <ListItem
                            key={subtask.id}
                            disableGutters
                            sx={{
                              bgcolor: "background.paper",
                              borderRadius: 1,
                              boxShadow: 1,
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              px: 2,
                              py: 0.75,
                              height: "fit-content",
                              "& .MuiListItemSecondaryAction-root": {
                                position: "relative",
                                transform: "none",
                                top: "auto",
                                right: "auto",
                              },
                            }}
                          >
                            <IconButton
                              edge="start"
                              onClick={() => handleToggleSubtask(subtask.id)}
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
                                m: 0,
                                flex: "1 1 auto",
                                minWidth: 0,
                                "& .MuiTypography-root": {
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                },
                              }}
                            />
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              sx={{
                                color: "error.main",
                                ml: 1,
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      justifyContent: "space-between",
                      opacity: expandTask && expandTask.id === task.id ? 1 : 0,
                      transform:
                        expandTask && expandTask.id === task.id
                          ? "translateY(0)"
                          : "translateY(20px)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
                    }}
                  >
                    <Box>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(task)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(task.id)}
                        startIcon={
                          deletingTaskId === task.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        disabled={deletingTaskId === task.id}
                      >
                        {deletingTaskId === task.id ? "Deleting..." : "Delete"}
                      </Button>
                    </Box>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(e) => handleDetailsClick(e, null)}
                      startIcon={<InfoIcon />}
                    >
                      Show Less
                    </Button>
                  </CardActions>
                </>
              ) : (
                <>
                  <CardContent sx={{ flexGrow: 1, py: 1.5, px: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(task.id);
                        }}
                        size="small"
                      >
                        {task.status === "completed" ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </IconButton>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          flex: 1,
                          fontSize: "1rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          ...(task.priority === "medium" && {
                            backgroundColor: "#FFD700",
                            "& .MuiChip-label": {
                              color: "#000",
                            },
                          }),
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1.5,
                      }}
                    >
                      {task.description || "No description"}
                    </Typography>

                    <Box sx={{ mb: 1.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Progress:
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {getTaskProgress(task)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getTaskProgress(task)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(0, 0, 0, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor: (theme) =>
                              getProgressColor(getTaskProgress(task)),
                            transition:
                              "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : "No due date"}
                        </Typography>
                      </Box>
                      <Chip
                        label={task.status}
                        size="small"
                        color={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in_progress"
                            ? "info"
                            : "default"
                        }
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      p: 2,
                      pt: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(task)}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(task.id)}
                        startIcon={
                          deletingTaskId === task.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        disabled={deletingTaskId === task.id}
                      >
                        {deletingTaskId === task.id ? "Deleting..." : "Delete"}
                      </Button>
                    </Box>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(e) => handleDetailsClick(e, task)}
                      startIcon={<InfoIcon />}
                    >
                      See more...
                    </Button>
                  </CardActions>
                </>
              )}
            </Card>
          ))}
        </Box>
      </Box>

      <Modal
        open={!!selectedTask}
        onClose={handleCloseDetail}
        aria-labelledby="task-detail-title"
        aria-describedby="task-detail-description"
        closeAfterTransition
        sx={{
          "& .MuiBackdrop-root": {
            bgcolor: "rgba(0, 0, 0, 0.5)",
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
      >
        <Fade in={!!selectedTask} timeout={200}>
          <Box
            sx={{
              ...modalStyle,
              opacity: !!selectedTask ? 1 : 0,
              transform: !!selectedTask
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -40%) scale(0.95)",
              transition: theme.transitions.create(["transform", "opacity"], {
                duration: 200,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              }),
            }}
          >
            {selectedTask && (
              <TaskDetail
                task={selectedTask}
                onClose={handleCloseDetail}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEdit}
                isEditing={isEditing}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default TaskList;
