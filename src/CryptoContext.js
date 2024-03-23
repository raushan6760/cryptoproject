import React, { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "./Config/Api";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
const Crypto = createContext();
const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setcoins] = useState([]);
  const [loading, setloading] = useState(false);


  // const [count, setCount] = useState(Number(localStorage. count || 0))

  const [alert, setalert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [watchlist, setwatchlist] = useState([]);
  const [portfolio, setportfolio] = useState([]);

  const [user, setuser] = useState(null);

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  useEffect(() => {

    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          console.log(coin.data().coins);
          setwatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const coinRef1 = doc(db, "portfolio", user?.uid);
      var unsubscribe1 = onSnapshot(coinRef1, (coin) => {
        if (coin.exists()) {
          console.log(coin.data().coins);
          setportfolio(coin.data().coins);
        } else {
          console.log("No Items in Portfolio");
        }
      });

      return () => {
        unsubscribe1();
      };
    }
  }, [user]);

  console.log("watchlist in context", watchlist);
  console.log("portfolio in context", portfolio);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setuser(user);
      else setuser(null);

      console.log("user in context :", user);
    });
  }, []);

 
  // console.log("+" , user)

  const fetchCoins = async () => {
    try {
      setloading(true);
      const { data } = await axios.get(CoinList(currency));
      setloading(false);
      setcoins(data);
    } catch (error) {
      console.error("Error fetching Coins List :", error);
    }
  };

  useEffect(() => {
    //     // console.log(loading)
    //     // Delay the execution of fetchTrendingCoins by 10 seconds
    const delay = 2000;
    const timer = setTimeout(() => {
      fetchCoins();
    }, delay);

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [currency]);

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <>
      <Crypto.Provider
        value={{
          currency,
          setCurrency,
          symbol,
          coins,
          loading,
          fetchCoins,
          alert,
          setalert,
          user,
          watchlist,
          portfolio,
          // dummycoin,
          // setdummycoin,
        }}
      >
        {children}
      </Crypto.Provider>
    </>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
