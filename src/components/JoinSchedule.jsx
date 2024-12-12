import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  useTheme,
  Fade,
} from '@mui/material'
import { Add as CreateIcon, Login as JoinIcon } from '@mui/icons-material'

function JoinSchedule() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [name, setName] = useState('')
  const [scheduleId, setScheduleId] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  const handleCreateClick = () => {
    navigate('/create')
  }

  const handleJoinClick = () => {
    setShowJoinForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (scheduleId && name) {
      navigate(`/schedule/${scheduleId}?name=${encodeURIComponent(name)}`)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          background: theme.palette.background.paper,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              mb: 4,
              fontWeight: 600,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                : 'linear-gradient(45deg, #2196f3 30%, #1976d2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Easy Schedule
          </Typography>

          {!showJoinForm ? (
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CreateIcon />}
                onClick={handleCreateClick}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
              >
                Create New Schedule
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<JoinIcon />}
                onClick={handleJoinClick}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                }}
              >
                Join Existing Schedule
              </Button>
            </Stack>
          ) : (
            <Fade in={showJoinForm}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                    autoFocus
                  />
                  <TextField
                    label="Schedule ID"
                    value={scheduleId}
                    onChange={(e) => setScheduleId(e.target.value)}
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!name || !scheduleId}
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                    }}
                  >
                    Join Schedule
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => setShowJoinForm(false)}
                    sx={{ mt: 1 }}
                  >
                    Back to Options
                  </Button>
                </Stack>
              </form>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default JoinSchedule
