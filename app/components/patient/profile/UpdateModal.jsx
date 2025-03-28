"use client"
import React from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const UpdateModal = ({ open, handleClose, section, fields, initialValues, onSubmit }) => {
  const maxDate = dayjs().subtract(19, "year"); // At least 18 years old
  const minDate = dayjs().subtract(100, "year"); 
  const validationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      let fieldValidation = Yup.string();

      if (field.required) {
        fieldValidation = fieldValidation.required(`${field.label} is required`);
      }

      if (field.type === "email") {
        fieldValidation = fieldValidation.email("Invalid email format");
      } else if (field.name === "phone") {
        fieldValidation = fieldValidation.matches(/^\+?\d{10,15}$/, "Invalid phone number");
      } else if (["fullName", "name", "relationship"].includes(field.name)) {
        fieldValidation = fieldValidation.matches(/^[A-Za-z\s]+$/, `${field.label} should only contain letters`);
      }

      return { ...schema, [field.name]: fieldValidation };
    }, {})
  );
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant='h6' component='h2' mb={2}>Update {section}</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values,{setSubmitting}) => {
            onSubmit(values)
            setSubmitting(false)
            handleClose()
          }}
        >
          {
            ({errors,touched,handleBlur,handleChange,values,setFieldValue}) => (
              <Form>
                {
                  fields.map((field) => {
                    if (field.type === 'select') {
                      return (
                        <FormControl fullWidth variant="outlined" margin="normal" key={field.name}>
                          <InputLabel>{field.label}</InputLabel>
                          <Field
                            as={Select}
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={field.label}
                            error={touched[field.name] && Boolean(errors[field.name])}
                          >
                            {field.options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                          {touched[field.name] && errors[field.name] && (
                            <FormHelperText>{errors[field.name]}</FormHelperText>
                      )}
                        </FormControl>
                      );
                    }  else if (field.type === "date") {
                  // ✅ Custom DatePicker Field for DOB
                  return (
                    <LocalizationProvider dateAdapter={AdapterDayjs} key={field.name}>
                      <FormControl fullWidth margin="normal" error={touched.dob && Boolean(errors.dob)}>
                        <DatePicker
                          label="Date of Birth"
                          value={values.dob ? dayjs(values.dob) : null}
                          onChange={(date) => setFieldValue("dob", date?.format("YYYY-MM-DD"))}
                          maxDate={maxDate}
                          minDate={minDate}
                          views={["year", "month", "day"]}
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              size: "small",
                              sx: {
                                width: "100%",
                                height: "48px",
                              },
                              error: touched.dob && Boolean(errors.dob),
                              helperText: touched.dob && errors.dob,
                            },
                          }}
                        />
                        {touched.dob && errors.dob && <FormHelperText>{errors.dob}</FormHelperText>}
                      </FormControl>
                    </LocalizationProvider>
                  );
                } else {
                      return (
                        <Field
                          key={field.name}
                          as={TextField}
                          name={field.name}
                          label={field.label}
                          type={field.type || "text"}
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={touched[field.name] && Boolean(errors[field.name])}
                          helperText={touched[field.name] && errors[field.name]}
                        />
                      );
                    }
                  })
                }

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Save Changes
                </Button>
              </Form>
            )
          }
        </Formik>
      </Box>
    </Modal>
  )
}

export default UpdateModal