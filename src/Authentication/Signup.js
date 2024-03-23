import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../Firebase";

const Signup = ({ handleClose }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");

  const { setalert } = CryptoState();

  const handleSubmit = async () => {
  
    if (password !== confirmpassword) {
      setalert({
        open: true,
        type: "error",
        message: "Password do not match ",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password, 
      );

      console.log("result = ",result)
      setalert({
        open: true,
        type:"success",
        message: `Sign Up Successful. Welcome ${result.user.email}`,
      });
      handleClose();
    } catch (error) {
      setalert({
        open: true,
        type: "error",
        message: error.message,
      });
      return;
    }
  };
  return (
    <Box
      style={{
        padding: (0, 15),
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
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
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={confirmpassword}
        onChange={(e) => setconfirmpassword(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#EEBC1D" }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
