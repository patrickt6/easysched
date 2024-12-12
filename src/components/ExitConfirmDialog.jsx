import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

function ExitConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Exit to Main Menu?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to return to the main menu? Any unsaved changes will be lost.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExitConfirmDialog
