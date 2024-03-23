import {
  AppBar,
  Container,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import AuthModal from "../Authentication/AuthModal";
import UserSidebar from "../Authentication/UserSidebar";
import Portfolio from "../Authentication/Portfolio";

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "Pointer",
    color: "gold",
  },
}));

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {currency,setCurrency,user }=CryptoState()
console.log(currency)
  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: "#fff",
      },
    },
  });
  return (
    
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" onClick={() => navigate("/")} className={classes.title}>
              Crypto Simulator 
            </Typography>
            <Select
              variant="outlined"
              value={currency} onChange={(e)=>setCurrency(e.target.value)}
              style={{
                width: 100,
                height: 40,
                marginRight: 15
              }}
            >
            
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>

            {user ? <Portfolio/> : ""}
            {user? <UserSidebar/>:< AuthModal />}

          </Toolbar>
        </Container>
      </AppBar>
      </ThemeProvider>
    
  );
};

export default Header;
