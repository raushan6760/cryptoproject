import React from 'react'
import { CryptoState } from '../CryptoContext'
import MuiAlert from "@material-ui/lab/Alert"
import { Snackbar } from '@material-ui/core'
const Alert = () => {
    const {alert,setalert} = CryptoState()
    const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
   setalert({open: false}) 
  };
  return (
    <div>
    
       <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert  onClose={handleClose}
        elevation={10}
        variant="filled"
        severity={alert.type}>{alert.message}</MuiAlert>
       </Snackbar>
    </div>
  )
}

export default Alert
