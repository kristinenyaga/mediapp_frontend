"use client";
import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import api from "@/app/utils/axiosInstance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
  outline:'none'
};

const FeedbackModal = ({ open, handleClose, lastAppointment }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }
    setLoading(true);

    try {
      await api.post(`/api/feedback/appointments/${lastAppointment?.id}/submit`, {
        rating,
        comment,
      });

      setRating(0);
      setComment("");
      handleClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
    finally {
    setLoading(false);
  }
  };

  const handleDecline = async () => {
    setLoading(true)
    try {
      await api.patch(`/api/feedback/appointments/${lastAppointment?.id}/decline`, {});

      handleClose();
    } catch (error) {
      console.error("Error declining feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" fontWeight="bold" textAlign="center" mb={2}>
          How was your last appointment?
        </Typography>

        {/* Star Rating */}
        <Box display="flex" justifyContent="center" mb={2}>
          {[1, 2, 3, 4, 5].map((index) => (
            <IconButton key={index} onClick={() => handleStarClick(index)}>
              {index <= rating ? (
                <Star sx={{ color: "#FFD700", fontSize: 32 }} />
              ) : (
                <StarBorder sx={{ color: "#FFD700", fontSize: 32 }} />
              )}
            </IconButton>
          ))}
        </Box>

        {/* Comment Input */}
        <TextField
          label="Leave a comment"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between">
          <Button onClick={handleDecline} variant="outlined" color="secondary">
            Decline Feedback
          </Button>
          <Button disabled={loading} onClick={handleSubmit} variant="contained" color="primary">
            Submit Feedback
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;
