"use client"
import React from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Formik, Form, Field } from "formik";
import { BsXLg } from "react-icons/bs";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 6,
  p: 4,
  
};

const DiagnosisModal = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <BsXLg className='flex items-end font-semibold text-lg' />
        <p>Patient x diagnosis details</p>
      </Box>
    </Modal>
  )

}

export default DiagnosisModal