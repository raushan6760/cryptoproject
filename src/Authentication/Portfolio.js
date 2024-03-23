import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { CryptoState } from "../CryptoContext";
import { Avatar } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { numberWithCommas } from "../Pages/Coinpage";
import { AiFillDelete } from "react-icons/ai";
import { collectionGroup, doc, setDoc } from "firebase/firestore";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles({
  container: {
    width: 550,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#EEBC1D",
    objectFit: "contain",
  },
  logout: {
    height: "8%",
    width: "100%",
    backgroundColor: "#EEBC1D",
    marginTop: 20,
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEBC1D",
    boxShadow: "0 0 3px black",
  },
});



export default function Portfolio() {
  const classes = useStyles();
  const {
    user,
    setalert,
    watchlist,
    coins,
    symbol,
    // dummycoin,
    // setdummycoin,
    portfolio,
    currency
   
  } = CryptoState();

  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    setalert({
      open: true,
      type: "success",
      message: "Logout Successful !",
    });
    toggleDrawer();
  };

  const [dummycoin, setdummycoin] = useState(() => {
    // localStorage.setItem("dummycoin",20000)
    // console.log(`dummycoin${user?.uid}`)
    const storedDummycoin = Number(localStorage.getItem(`dummycoin${user?.uid}`));
    // console.log("dummmy found previously" , localStorage.getItem(`dummycoin${user?.uid}`))
    return storedDummycoin ? Number(storedDummycoin) : localStorage.setItem((`dummycoin${user?.uid}`),200000);
  });

  // const sellCoin = async (coin) => {
  //   const coinRef1 = doc(db, "portfolio", user.uid);
  //   try {
  //     await setDoc(
  //       coinRef1,
  //       {
  //         coins: portfolio.filter((watch) => watch != coin?.id),
  //       },
  //       {
  //         merge: true
  //       }
  //     );
      
  //     const updatedDummyCoin = dummycoin + coin?.current_price;
  //     setdummycoin(updatedDummyCoin);
  //     localStorage.setItem(`dummycoin${user?.uid}`, updatedDummyCoin.toString());
  //    localStorage.removeItem(`${coin?.name}${user?.uid}`)
  //     setalert({
  //       open: true,
  //       message: `${coin.name} Sold From The PORTFOLIO `,
  //       type: "success",
  //     });
  //   } catch (error) {
  //     setalert({
  //       open: true,
  //       message: error.message,
  //       type: "error",
  //     });
  //   }
  // };

  const sellCoin = async (coin) => {
    const coinRef1 = doc(db, "portfolio", user.uid);
    try {
      await setDoc(
        coinRef1,
        {
          coins: portfolio.filter((watch) => watch != coin?.id),
        },
        {
          merge: true
        }
      );
      // console.log("coinpage coins  ==== ", coin)
      const updatedDummyCoin = Number(localStorage.getItem(`dummycoin${user?.uid}`)) + coin?.current_price
      setdummycoin(updatedDummyCoin);
      localStorage.setItem(`dummycoin${user?.uid}`, updatedDummyCoin);
      
     localStorage.removeItem(`${coin?.name}${user?.uid}`)
      setalert({
        open: true,
        message: `${coin.name} Sold From The PORTFOLIO `,
        type: "success",
      });
    } catch (error) {
      setalert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  let profit;

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ backgroundColor: "green", marginRight: 15 }}
            onClick={toggleDrawer(anchor, true)}
          >
            {symbol} {Number(localStorage.getItem(`dummycoin${user?.uid}`)) ? parseFloat(localStorage.getItem(`dummycoin${user?.uid}`)).toFixed(2) : 200000.00}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />

                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}{" "}
                </span>

                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    // color:"green",
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  YOUR PORTFOLIO : {symbol}{" "}
                  {Number(localStorage.getItem(`dummycoin${user?.uid}`)) ? parseFloat(localStorage.getItem(`dummycoin${user?.uid}`)).toFixed(2) : 200000.00}
                </span>

                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    YOUR COINS
                  </span>

                  {coins.map((coin) => {
                    if(portfolio.includes(coin.id)){profit = coin.current_price -
                      Number(localStorage.getItem(`${coin?.name}${user?.uid}`))
                    
                                }
                    if (portfolio.includes(coin.id))
                      return (
                        <div key={coin.id} className={classes.coin}>
                          <span>{coin.name}</span>
                          
                          <span
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              marginLeft: 25,
                            }}
                          >
                            <span> BUYING PRICE </span>
                            <span>
                              {symbol} {Number(localStorage.getItem(`${coin.name}${user?.uid}`))}
                            </span>
                          </span>

                          <span
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            <span>CURRENT PRICE </span>
                            <span>
                              {symbol}{" "}
                              {numberWithCommas(coin.current_price.toFixed(2))}
                            </span>
                          </span>

                        
                              
                          <span
                            style={{
                              color: profit >= 0 ? "rgb(14,203,129" : "red",
                              fontWeight: 500,
                            }}
                          >
                            {" "}
                            {symbol} {profit >= 0 ? "+" : ""}{" "}
                            {numberWithCommas(
                              (
                                coin.current_price -
                                Number(localStorage.getItem(`${coin.name}${user?.uid}`))
                              ).toFixed(2)
                            )}{" "}
                          </span>

                         
                          <Button
                            style={{
                              cursor: "pointer",
                              backgroundColor: "red",
                            }}
                            fontSize="16"
                            onClick={() => sellCoin(coin)}
                          >
                            {" "}
                            Sell{" "}
                          </Button>
                        </div>
                      );
                  })}
                </div>
              </div>

              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
