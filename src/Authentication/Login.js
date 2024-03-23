import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

const Login = ({ handleClose }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
const {setalert} = CryptoState()

  const handleSubmit=async ()=>{
    if(!email || !password){
        setalert({
            open: true,
            type: "error",
            message: "Please Fill all the Fields ",
          });
          return;
    }
    try{
     const result = await signInWithEmailAndPassword(auth,email,password);

     setalert({
        open: true,
        type:"success",
        message: `Login Successful. Welcome ${result.user.email}`,
      });
      handleClose();

    }catch(error)
    {
        setalert({
            open: true,
            type: "error",
            message: error.message,
          });
          return;
    }
  }
  return (
    <Box 
      
      style={{ padding:(0 ,15) , display: "flex", flexDirection: "column",  gap: "20px", }}
    >
      <TextField 
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        fullWidth
      />

      <TextField
        variant="outlined"
        label="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#EEBC1D" }}
        onClick={handleSubmit}
      >
        Login 
      </Button>
    </Box>
  );
};

export default Login;
