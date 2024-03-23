import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../Config/Api";
import axios from "axios";
import {
  Button,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CoinInfo from "../Components/CoinInfo";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

// import ReactHtmlParser from "react-html-parser"
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketdata: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const Coinpage = () => {
  const classes = useStyles();
  const { currency, symbol, user, watchlist, setalert ,portfolio} = CryptoState();
  const { id } = useParams();
  const [coin, setcoin] = useState();
  // const [inwatchlist,setinwatchlist] =useState(false);

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setcoin(data);
    } catch (error) {
      console.error("Error fetching Coins Description :", error);
    }
  };
  // if(watchlist.includes(coin?.id)){
  //   setinwatchlist(true);
  // }
  const inwatchlist = watchlist.includes(coin?.id);

  const addtowatchlist = async () => {
    await fetchCoin();
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
      }
      ,
        {
          merge: true
        });
      // setinwatchlist(true);
      setalert({
        open: true,
        message: `${coin.name} Added TO The Watchlist `,
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

  const removefromwatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch != coin?.id),
        },
        {
          merge: true
        }
      );

      setalert({
        open: true,
        message: `${coin.name} Removed From The Watchlist `,
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

  const inportfolio = portfolio.includes(coin?.id);
  const [dummycoin, setdummycoin] = useState(() => {
    // localStorage.setItem("dummycoin",20000)
    // console.log(`dummycoin${user?.uid}`)
    const storedDummycoin = Number(localStorage.getItem(`dummycoin${user?.uid}`));
    // console.log("dummmy found previously" , localStorage.getItem(`dummycoin${user?.uid}`))
    return storedDummycoin ? Number(storedDummycoin) : 200000;
  });

  const buyCoin = async () => {
    if((Number(localStorage.getItem(`dummycoin${user?.uid}`)) ? Number(localStorage.getItem(`dummycoin${user?.uid}`)) : 200000) < coin?.market_data.current_price[currency.toLowerCase()])
    {
      setalert({
        open: true,
        type:"error",
        message: `INSUFFICIENT BALANCE `,
      })
      return ;
    }
    await fetchCoin();
    const coinRef1 = doc(db, "portfolio", user.uid);
    try {
      await setDoc(coinRef1, {
        coins: portfolio ? [...portfolio, coin?.id] : [coin?.id],
      }
      ,
        {
          merge: true
        });
 
        const updatedDummyCoin = Number(localStorage.getItem(`dummycoin${user?.uid}`)) - coin?.market_data.current_price[currency.toLowerCase()];
      setdummycoin(updatedDummyCoin);
      localStorage.setItem(`dummycoin${user?.uid}`, updatedDummyCoin);

      localStorage.setItem(`${coin?.name}${user?.uid}`,coin?.market_data.current_price[currency.toLowerCase()])
      setalert({
        open: true,
        message: `${coin.name} Added TO The PORTFOLIO `,
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

  const sellCoin = async () => {
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
    //  console.log("printing " , localStorage.getItem(`dummycoin${user?.uid}`) )
      const updatedDummyCoin = Number(localStorage.getItem(`dummycoin${user?.uid}`)) + coin?.market_data.current_price[currency.toLowerCase()];
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

  console.log("portfolio updated :" ,portfolio)
  console.log("watchlist updated", watchlist);
  // console.log("why giving false ", inwatchlist);

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("coin present in coinpage ", coin);

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />

        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>

        <Typography varaiant="subtitle1" className={classes.description}>
          {coin?.description.en.split(". ")[0]}
        </Typography>
        <div className={classes.marketdata}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              {" "}
              Rank :{" "}
            </Typography>{" "}
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              {" "}
              Current Price :{" "}
            </Typography>{" "}
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              {" "}
              Market Cap :{" "}
            </Typography>{" "}
            &nbsp;&nbsp;
            <Typography variant="h5" style={{ fontFamily: "Montserrat" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                backgroundColor: inwatchlist ? "#ff0000" : "#EEBC1D",
                // textTransform:"none",
              }}
              onClick={inwatchlist ? removefromwatchlist : addtowatchlist}
            >
              {inwatchlist ? "Remove from watchlist " : "add to watchlist "}
            </Button>
          )}

          {user && (
            <Button
            
              variant="outlined"
              style={{
                marginTop:"15px",
                width: "100%",
                height: 40,
                backgroundColor: inportfolio ? "red" : "green",
                // textTransform:"none",
              }}
              onClick={inportfolio ? sellCoin : buyCoin}
            >
            
              {inportfolio ? `sell ${coin.name}` : `buy ${coin.name}`}
            </Button>
          )}
        </div>
      </div>

      <CoinInfo coin={coin}> </CoinInfo>
    </div>
  );
};

export default Coinpage;
