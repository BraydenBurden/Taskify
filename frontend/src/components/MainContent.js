import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { useAuth } from "../contexts/AuthContext";

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

const MainContent = ({ mode, toggleColorMode }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTaskCreated = (newTask) => {
    handleClose();
    // The TaskList component will automatically refresh its data
    // when it receives the new task through the onSubmit callback
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Typography variant="h6">Welcome, {user.name}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: 2,
                fontSize: "1rem",
                px: 3,
                py: 1,
              }}
            >
              New Task
            </Button>
            <IconButton onClick={logout} color="inherit">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
        <Paper sx={{ p: 3 }}>
          <TaskList />
        </Paper>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          "& .MuiBackdrop-root": {
            bgcolor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box sx={modalStyle}>
          <TaskForm onSubmit={handleTaskCreated} onClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
};

export default MainContent;
