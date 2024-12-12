import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useMediaQuery, CssBaseline, Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMemo, useState } from 'react'
import CreateSchedule from './components/CreateSchedule'
import JoinSchedule from './components/JoinSchedule'
import ScheduleView from './components/ScheduleView'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
          },
          secondary: {
            main: '#f50057',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#ffffff',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            '@media (max-width:600px)': {
              fontSize: '2rem',
            },
          },
          h2: {
            fontSize: '2rem',
            '@media (max-width:600px)': {
              fontSize: '1.75rem',
            },
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                padding: '10px 20px',
                '@media (max-width:600px)': {
                  width: '100%',
                  marginBottom: '10px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'dark' 
                  ? '0 4px 6px rgba(0, 0, 0, 0.4)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 2, sm: 3 },
              maxWidth: '100%',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <Routes>
              <Route path="/" element={<JoinSchedule />} />
              <Route path="/create" element={<CreateSchedule />} />
              <Route path="/schedule/:id" element={<ScheduleView />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
