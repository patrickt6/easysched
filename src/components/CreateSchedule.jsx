import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

function CreateSchedule() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    dayStartTime: '09:00',
    dayEndTime: '17:00',
    slotDuration: 30,
  })

  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const pin = generatePin()
      const scheduleRef = await addDoc(collection(db, 'schedules'), {
        ...formData,
        pin,
        createdAt: new Date().toISOString(),
        participants: []
      })

      setToast({
        open: true,
        message: `Schedule created! Your PIN code is: ${pin}`,
        severity: 'success'
      })

      navigate(`/schedule/${scheduleRef.id}`)
    } catch (error) {
      setToast({
        open: true,
        message: error.message,
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Stack spacing={3}>
        <TextField
          required
          label="Schedule Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
        />

        <TextField
          required
          type="date"
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          required
          type="date"
          label="End Date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          required
          type="time"
          label="Day Start Time"
          value={formData.dayStartTime}
          onChange={(e) => setFormData({ ...formData, dayStartTime: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          required
          type="time"
          label="Day End Time"
          value={formData.dayEndTime}
          onChange={(e) => setFormData({ ...formData, dayEndTime: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          required
          type="number"
          label="Time Slot Duration (minutes)"
          value={formData.slotDuration}
          onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
          inputProps={{ min: 15, max: 120, step: 15 }}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Schedule'}
        </Button>
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CreateSchedule
