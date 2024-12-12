import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  Alert,
  Snackbar,
} from '@mui/material'
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'
import { format, parseISO, eachDayOfInterval } from 'date-fns'

function ScheduleView() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const userName = searchParams.get('name')
  const [schedule, setSchedule] = useState(null)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('error')

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'schedules', id), (doc) => {
      if (doc.exists()) {
        setSchedule({ id: doc.id, ...doc.data() })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [id])

  const generateTimeSlots = () => {
    if (!schedule) return []

    const startTime = parseInt(schedule.dayStartTime.split(':')[0])
    const endTime = parseInt(schedule.dayEndTime.split(':')[0])
    const slotDuration = schedule.slotDuration

    const slots = []
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        )
      }
    }
    return slots
  }

  const getDays = () => {
    if (!schedule) return []
    return eachDayOfInterval({
      start: parseISO(schedule.startDate),
      end: parseISO(schedule.endDate)
    })
  }

  const handleSlotClick = async (day, time) => {
    const slotKey = `${format(day, 'yyyy-MM-dd')}_${time}`
    
    try {
      const scheduleRef = doc(db, 'schedules', id)
      if (selectedSlots.includes(slotKey)) {
        await updateDoc(scheduleRef, {
          [`availability.${slotKey}.${userName}`]: false
        })
        setSelectedSlots(selectedSlots.filter(slot => slot !== slotKey))
      } else {
        await updateDoc(scheduleRef, {
          [`availability.${slotKey}.${userName}`]: true
        })
        setSelectedSlots([...selectedSlots, slotKey])
      }
    } catch (error) {
      setToastOpen(true)
      setToastMessage(error.message)
      setToastSeverity('error')
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (!schedule) {
    return <Typography>Schedule not found</Typography>
  }

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Stack spacing={6} direction="column" alignItems="stretch">
        <Box>
          <Typography variant="h4">{schedule.title}</Typography>
          <Typography color="gray">Select your available time slots</Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} />
          <Grid item xs={12}>
            <Stack direction="row" spacing={4} overflow="auto" pb={2}>
              {getDays().map((day) => (
                <Box key={day.toISOString()} minWidth="150px" textAlign="center">
                  <Typography fontWeight="bold">{format(day, 'MMM d')}</Typography>
                  <Typography fontSize="small">{format(day, 'EEEE')}</Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          {generateTimeSlots().map((time) => (
            <Grid item xs={12} key={time}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Box width="60px" textAlign="right">
                  <Typography fontSize="small">{time}</Typography>
                </Box>
                <Stack direction="row" spacing={4} overflow="auto">
                  {getDays().map((day) => {
                    const slotKey = `${format(day, 'yyyy-MM-dd')}_${time}`
                    const availability = schedule.availability?.[slotKey] || {}
                    const isSelected = availability[userName]
                    const totalAvailable = Object.values(availability).filter(Boolean).length

                    return (
                      <Button
                        key={day.toISOString()}
                        minWidth="150px"
                        height="10px"
                        variant="outlined"
                        color={isSelected ? "success" : "inherit"}
                        sx={{ opacity: totalAvailable > 0 ? 0.3 + (totalAvailable * 0.2) : 1 }}
                        onClick={() => handleSlotClick(day, time)}
                      >
                        {totalAvailable > 0 && (
                          <Typography fontSize="small">{totalAvailable}</Typography>
                        )}
                      </Button>
                    )
                  })}
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
      >
        <Alert severity={toastSeverity}>{toastMessage}</Alert>
      </Snackbar>
    </Box>
  )
}

export default ScheduleView
