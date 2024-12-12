import { useState } from 'react'
import { Box, Typography, Stack, Link } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate, useLocation } from 'react-router-dom'
import ExitConfirmDialog from './ExitConfirmDialog'

function Footer() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      setDialogOpen(true)
    }
  }

  const handleConfirmExit = () => {
    setDialogOpen(false)
    navigate('/')
  }

  return (
    <>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.mode === 'light' 
            ? theme.palette.grey[100]
            : theme.palette.grey[900]
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          maxWidth="lg"
          mx="auto"
        >
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ 
              cursor: location.pathname !== '/' ? 'pointer' : 'default',
              '&:hover': {
                opacity: location.pathname !== '/' ? 0.8 : 1
              }
            }}
            onClick={handleLogoClick}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 300,
                letterSpacing: 1,
                textTransform: 'lowercase',
                color: theme.palette.text.secondary
              }}
            >
              whosbusy
            </Typography>
            <img
              src="/logos/icon-logo.png"
              alt="WhosBusy Icon"
              style={{ height: '16px' }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" align="center">
            {currentYear} Created by{' '}
            <Link
              href="https://github.com/patrickt6"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ textDecoration: 'underline' }}
            >
              Patrick Taylor
            </Link>
          </Typography>
        </Stack>
      </Box>

      <ExitConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  )
}

export default Footer
