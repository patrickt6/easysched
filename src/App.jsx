import { ThemeProvider } from '@mui/material/styles'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreateSchedule from './components/CreateSchedule'
import JoinSchedule from './components/JoinSchedule'
import ScheduleView from './components/ScheduleView'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<JoinSchedule />} />
            <Route path="/create" element={<CreateSchedule />} />
            <Route path="/schedule/:id" element={<ScheduleView />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  )
}

export default App
