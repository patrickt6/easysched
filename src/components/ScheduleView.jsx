import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  ChevronLeft as BackIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import isSameDay from 'date-fns/isSameDay'

function ScheduleView() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const userName = searchParams.get('name')

  const [schedule, setSchedule] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'schedules', id), (doc) => {
      if (doc.exists()) {
        setSchedule({ id: doc.id, ...doc.data() })
      }
    })
    return () => unsubscribe()
  }, [id])

  const handleSlotClick = async (slotKey) => {
    try {
      const scheduleRef = doc(db, 'schedules', id)
      const currentAvailability = schedule.availability[slotKey] || {}
      const newAvailability = {
        ...schedule.availability,
        [slotKey]: {
          ...currentAvailability,
          [userName]: !currentAvailability[userName]
        }
      }

      await updateDoc(scheduleRef, { availability: newAvailability })
      
      setSnackbar({
        open: true,
        message: currentAvailability[userName] 
          ? 'Availability removed'
          : 'Availability added',
        severity: 'success'
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating availability',
        severity: 'error'
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: schedule.title,
        text: `Join my schedule: ${schedule.title}`,
        url: window.location.href
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        navigator.clipboard.writeText(window.location.href)
        setSnackbar({
          open: true,
          message: 'Link copied to clipboard',
          severity: 'success'
        })
      }
    }
  }

  const renderTimeSlot = (time, date) => {
    const slotKey = `${format(date, 'yyyy-MM-dd')}_${time}`
    const availability = schedule.availability[slotKey] || {}
    const isAvailable = availability[userName]
    const totalAvailable = Object.entries(availability).filter(([, value]) => value).length

    return (
      <Button
        key={slotKey}
        variant={isAvailable ? "contained" : "outlined"}
        onClick={() => handleSlotClick(slotKey)}
        fullWidth
        sx={{
          height: '48px',
          justifyContent: 'space-between',
          mb: 1,
          borderRadius: 2,
          opacity: totalAvailable > 0 ? 0.7 + (totalAvailable * 0.1) : 1
        }}
      >
        <Typography variant="body2">{time}</Typography>
        {totalAvailable > 0 && (
          <Chip
            label={totalAvailable}
            size="small"
            color={isAvailable ? "primary" : "default"}
            sx={{ ml: 1 }}
          />
        )}
      </Button>
    )
  }

  if (!schedule) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading schedule...</Typography>
      </Box>
    )
  }

  const startDate = parseISO(schedule.startDate)
  const endDate = parseISO(schedule.endDate)

  return (
    <Box sx={{ pb: isMobile ? 8 : 3 }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.default', p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => navigate('/')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>{schedule.title}</Typography>
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={() => setInfoDrawerOpen(true)}>
            <InfoIcon />
          </IconButton>
        </Stack>
      </Box>

      <Stack spacing={3} sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <CalendarIcon color="primary" />
              <Typography variant="h6">
                {format(selectedDate, 'EEEE, MMMM d')}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              {Array.from(
                { length: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 },
                (_, index) => {
                  const date = new Date(startDate)
                  date.setDate(date.getDate() + index)
                  return (
                    <Button
                      key={date.toISOString()}
                      variant={isSameDay(date, selectedDate) ? "contained" : "outlined"}
                      onClick={() => setSelectedDate(date)}
                      sx={{
                        minWidth: '48px',
                        height: '48px',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2">
                        {format(date, 'd')}
                      </Typography>
                    </Button>
                  )
                }
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={1}>
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(
                (time) => renderTimeSlot(time, selectedDate)
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Drawer
        anchor="right"
        open={infoDrawerOpen}
        onClose={() => setInfoDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>Schedule Details</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Created by"
                secondary={schedule.firstName}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Duration"
                secondary={`${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`}
              />
            </ListItem>
            {schedule.description && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Description"
                    secondary={schedule.description}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ScheduleView
