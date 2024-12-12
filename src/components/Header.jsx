import { useState } from 'react'
import { AppBar, Toolbar, Stack, Typography } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import ExitConfirmDialog from './ExitConfirmDialog'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [dialogOpen, setDialogOpen] = useState(false)

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
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          borderBottom: (theme) => 
            `1px solid ${theme.palette.mode === 'light' 
              ? theme.palette.grey[200] 
              : theme.palette.grey[800]}`
        }}
      >
        <Toolbar>
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
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 300,
                letterSpacing: 1,
                textTransform: 'lowercase',
                color: (theme) => theme.palette.text.primary
              }}
            >
              whosbusy
            </Typography>
            <img
              src="/logos/icon-logo.png"
              alt="WhosBusy Icon"
              style={{ height: '24px' }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <ExitConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  )
}

export default Header
