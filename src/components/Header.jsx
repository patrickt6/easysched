import { useState } from 'react'
import { AppBar, Toolbar, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleLogoClick = () => {
    if (location.pathname === '/') return
    setDialogOpen(true)
  }

  const handleConfirmNavigation = () => {
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
              src="/assets/logos/whosbusyiconlogo.png"
              alt="WhosBusy Icon"
              style={{ height: '24px' }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Return to Home Page?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return to the home page? Any unsaved changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmNavigation} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Header
