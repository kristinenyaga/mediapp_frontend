import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import React from 'react'

const AvailableDoctors = ({ openReassignModal, setOpenMenu, setOpenReassignModal, availableDoctors, selectedDoctor, setSelectedDoctor, uploadReassign }) => {
  if (!availableDoctors) return <p>Loading...</p>;
  return (
    <>      
      <Dialog open={openReassignModal} onClose={() => setOpenReassignModal(false)}>
        <DialogTitle>Reassign Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a new doctor for this appointment.</DialogContentText>
          {availableDoctors?.length > 0 ? (
            <select
              className="mt-2 p-2 outline-none border rounded w-full"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select a Doctor</option>
              {availableDoctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.username} ({doc.specialty})
                </option>
              ))}
            </select>
          ) : (
            <Typography color="error">No available doctors found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenReassignModal(false)
            setOpenMenu(false)
          }}>Cancel</Button>
          <Button onClick={uploadReassign}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default AvailableDoctors