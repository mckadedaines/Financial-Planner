import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

const ChatGptComponent = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/getChatGptResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching ChatGPT response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mt-8">
      <Box className="text-center mb-6">
        <Typography
          variant="h3"
          component="h2"
          className="text-3xl font-bold text-slate-100"
          data-cy="chatgpt-title"
        >
          Ask ChatGPT
        </Typography>
      </Box>
      <Box className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here"
            style={{
              marginBottom: "20px",
              backgroundColor: "#1A202C",
              color: "white",
            }}
            InputProps={{
              style: { color: "white" },
            }}
            data-cy="chatgpt-question"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginBottom: "20px" }}
            data-cy="chatgpt-submit"
          >
            {loading ? (
              <CircularProgress
                size={24}
                style={{ color: "white" }}
                data-cy="chatgpt-loading"
              />
            ) : (
              "Get Response"
            )}
          </Button>
        </form>
        {loading && (
          <Typography
            variant="body1"
            align="center"
            data-cy="chatgpt-loading-text"
          >
            Loading...
          </Typography>
        )}
        {error && (
          <Typography
            variant="body1"
            color="error"
            align="center"
            gutterBottom
            data-cy="chatgpt-error"
          >
            Error: {error}
          </Typography>
        )}
        {response && (
          <Box mt={3} data-cy="chatgpt-response">
            <Typography variant="h6" gutterBottom>
              Response:
            </Typography>
            <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
              {response}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatGptComponent;
