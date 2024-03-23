import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { TrendingCoins } from "../../Config/Api";
import { CryptoState } from "../../CryptoContext";
import axios from "axios";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  carousel: {
    height: "50%",
    display: "flex",
    alignItems: "Center",
  },
  carouselItem:{
    display:"flex",
    flexDirection:"column",
    alignItems:"Center",
    cursor:"pointer",
    textTransform:"uppercase",
    color:"white",
  },
}));

export function numberWithCommas(x)
{
   return  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const classes = useStyles();
  const [trending, settrending] = useState([]);
  const { currency,symbol } = CryptoState();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const { data } = await axios.get(TrendingCoins(currency));
        console.log(data)
        
        settrending(data);
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };

    // Delay the execution of fetchTrendingCoins by 10 seconds
    const delay = 1900;
    const timer = setTimeout(() => {
      fetchTrendingCoins();
    }, delay);

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [currency]);

// console.log(trending)
  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >=0
   
    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin.image}
          alt={coin.name}
          height={80}
          style={{ marginBottom: 10 }}
        />
        <span>{coin.symbol} &nbsp; 
        <span style={{color:profit>0 ? "rgb(14,203,129": "red", fontWeight:500,}}>{profit && "+" } {coin?.market_cap_change_percentage_24h.toFixed(2)}% </span>
        </span>

        <span style={{fontSize:22,fontWeight:500}}> {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  // console.log(trending)
  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
