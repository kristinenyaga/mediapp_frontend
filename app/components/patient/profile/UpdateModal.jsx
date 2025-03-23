"use client"
import React from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Formik, Form, Field } from "formik";

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

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant='h6' component='h2' mb={2}>Update {section}</Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={(values,{setSubmitting}) => {
            onSubmit(values)
            setSubmitting(false)
            handleClose()
          }}
        >
          {
            ({errors,touched,handleBlur,handleChange,values}) => (
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
                        </FormControl>
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