"use client";
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const WorkingHoursModal = ({
  open,
  handleClose,
  sameHours,
  handleSaveWorkingHours,
  daysOfWeek,
  workingHours,
  handleWorkingHourChange,
}) => {
  const daysOrder = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};
const sortedWorkingHours = [...workingHours].sort((a,b)=>daysOrder[a.dayOfWeek] - daysOrder[b.dayOfWeek])
  console.log(workingHours)
  console.log(daysOfWeek)
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" mb={3}>
          Update Working Hours
        </Typography>

        {/* <FormControlLabel
          control={
            <Checkbox
              checked={sameHours}
              onChange={(e) => {
                setSameHours(e.target.checked);
                if (e.target.checked) {
                  applySameHours(
                    workingHours[0]?.startTime || "",
                    workingHours[0]?.endTime || ""
                  );
                }
              }}
            />
          }
          label="Apply same working hours for all days"
          sx={{ mb: 3 }}
        /> */}
        <div className="grid grid-cols-1 gap-4">
          {daysOfWeek.map((day) => {
            const currentDayHours =
            sortedWorkingHours.find((hour) => hour.dayOfWeek === day) || {
              startTime: "",
              endTime: "",
            };
            return (
            <div key={day} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">{day}</span>
              <div className="flex gap-4">
                <TextField
                type="time"
                size="small"
                value={currentDayHours.startTime}
                onChange={(e) =>
                handleWorkingHourChange(day, "startTime", e.target.value)
              }
                fullWidth
                disabled={sameHours}
              />
              <TextField
                type="time"
                size="small"
                value={currentDayHours.endTime}
                onChange={(e) =>
                  handleWorkingHourChange(day, "endTime", e.target.value)
              }
                fullWidth
                disabled={sameHours}
                />
                </div>
                </div>
                );
                })}
            </div>


        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveWorkingHours}
            sx={{
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default WorkingHoursModal;
