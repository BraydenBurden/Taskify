import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { authService } from "../services/api";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || verificationAttempted) return;

      try {
        setVerificationAttempted(true);
        const response = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(response.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.error || "Failed to verify email");
      }
    };

    verifyEmail();
  }, [token, verificationAttempted]);

  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {status === "verifying" && (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h5" component="h1" gutterBottom>
                Verifying your email...
              </Typography>
            </>
          )}

          {status === "success" && (
            <>
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="h5" component="h1" gutterBottom>
                Email Verified Successfully!
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                Your email has been verified. You can now log in to your
                account.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNavigate}
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="h5" component="h1" gutterBottom>
                Verification Failed
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                We couldn't verify your email. The link might be expired or
                invalid.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNavigate}
              >
                Go to Login
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;
