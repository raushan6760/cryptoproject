import React, { useEffect, useState } from "react";
import { CryptoState } from "../CryptoContext";
import { HistoricalChart } from "../Config/Api";
import { Chart as chartjs } from "chart.js/auto"

import {
  createTheme,
  ThemeProvider,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import { chartDays } from "../Config/Data";

import { Line } from "react-chartjs-2";
import SelectButton from "./SelectButton";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const CoinInfo = ({ coin }) => {
  const classes = useStyles();
  const [historicaldata, sethistoricaldata] = useState();
  const [days, setdays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setflag] = useState(false);

  useEffect(() => {
    const fetchhistoricdata = async () => {
      
      try {
        const { data } = await axios.get(
          HistoricalChart(coin.id, days, currency)
        );
        sethistoricaldata(data.prices);
        setflag(true);
      } catch (error) {
        console.error("Error fetching Chart Api  :", error);
      }
  
    };

    const delay = 1000;
    const timer = setTimeout(() => {
      fetchhistoricdata();
    }, delay);

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [coin.id, currency, days]);

  // console.log("coin showing in coinInfo page ", coin.id, days, currency);

  // console.log(historicaldata);

  const darktheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });


  return (
    <ThemeProvider theme={darktheme}>
      <div className={classes.container}>
        {!historicaldata | (flag === false) ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicaldata.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicaldata.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",

                  },
                ],
              }}

              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}

            />
 
            <div  style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}> 

            {chartDays.map((day) => (
                <SelectButton 
                  key={day.value}
                  onClick={() => {
                    if (Number(day.value) === days) return; 
                    setdays(Number(day.value));
                    setflag(false);
 
                  }}
                  selected ={day.value===days}   
                >
                  {day.label} 
                </SelectButton>
              ))}

            </div>
          </>
        )}

      </div>
    </ThemeProvider>
  );
};


export default CoinInfo;
