import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

function JoinSchedule() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const q = query(collection(db, 'schedules'), where('pin', '==', pin))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setToast({
          open: true,
          message: 'Invalid PIN. Please check and try again.',
          severity: 'error'
        })
        return
      }

      const scheduleDoc = querySnapshot.docs[0]
      navigate(`/schedule/${scheduleDoc.id}?name=${encodeURIComponent(name)}`)
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
    <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Easy Schedule
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Join a schedule or create your own
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              required
              label="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputProps={{
                maxLength: 4,
                pattern: '[0-9]*'
              }}
              fullWidth
            />

            <TextField
              required
              label="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Joining...' : 'Join Schedule'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body1">
          Want to create a new schedule?{' '}
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/create')}
          >
            Create Schedule
          </Link>
        </Typography>
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

export default JoinSchedule
