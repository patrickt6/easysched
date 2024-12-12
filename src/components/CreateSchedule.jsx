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
  Stepper,
  Step,
  StepLabel,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { addDays, addMonths } from 'date-fns'
import { ChevronLeft as BackIcon } from '@mui/icons-material'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const steps = ['Schedule Type', 'Details', 'Confirmation']

function CreateSchedule() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [activeStep, setActiveStep] = useState(0)
  const [scheduleType, setScheduleType] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 7))
  const [firstName, setFirstName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleScheduleTypeSelect = (type) => {
    setScheduleType(type)
    if (type === 'today') {
      setStartDate(new Date())
      setEndDate(addDays(new Date(), 7))
    } else if (type === 'future') {
      setStartDate(addDays(new Date(), 1))
      setEndDate(addDays(new Date(), 8))
    }
    setActiveStep(1)
  }

  const handleDurationSelect = (duration) => {
    if (duration === 'week') {
      setEndDate(addDays(startDate, 7))
    } else if (duration === 'month') {
      setEndDate(addMonths(startDate, 1))
    }
    setActiveStep(2)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      const scheduleData = {
        firstName,
        title: title || `${firstName}'s Schedule`,
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdAt: new Date().toISOString(),
        availability: {},
      }

      const docRef = await addDoc(collection(db, 'schedules'), scheduleData)
      navigate(`/schedule/${docRef.id}?name=${firstName}`)
    } catch (error) {
      console.error('Error creating schedule:', error)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              When would you like to start your schedule?
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleScheduleTypeSelect('today')}
              fullWidth
            >
              Starting Today
            </Button>
            <Button
              variant="contained"
              onClick={() => handleScheduleTypeSelect('future')}
              fullWidth
            >
              Starting in the Future
            </Button>
            <Button
              variant="contained"
              onClick={() => handleScheduleTypeSelect('custom')}
              fullWidth
            >
              Custom Dates
            </Button>
          </Stack>
        )

      case 1:
        return scheduleType === 'custom' ? (
          <Stack spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                minDate={new Date()}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              onClick={() => setActiveStep(2)}
              fullWidth
            >
              Continue
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              Select Duration
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleDurationSelect('week')}
              fullWidth
            >
              1 Week
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDurationSelect('month')}
              fullWidth
            >
              1 Month
            </Button>
            <Button
              variant="contained"
              onClick={() => setScheduleType('custom')}
              fullWidth
            >
              Custom Duration
            </Button>
          </Stack>
        )

      case 2:
        return (
          <Stack spacing={3}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Schedule Title (Optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder={firstName ? `${firstName}'s Schedule` : "Your Schedule"}
            />
            <TextField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!firstName}
              fullWidth
            >
              Create Schedule
            </Button>
          </Stack>
        )

      default:
        return null
    }
  }

  return (
    <Box>
      {activeStep > 0 && (
        <IconButton
          onClick={handleBack}
          sx={{ position: 'absolute', left: 16, top: 16 }}
        >
          <BackIcon />
        </IconButton>
      )}
      
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Create Schedule
        </Typography>

        {!isMobile && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Card>
          <CardContent>
            {renderStepContent(activeStep)}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default CreateSchedule
