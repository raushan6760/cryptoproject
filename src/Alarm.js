import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import './Alarm.css'; 

const CryptoAlarm = () => {
  const [alarms, setAlarms] = useState([]);
  const [currentCoin, setCurrentCoin] = useState("");
  const [currentPriceThreshold, setCurrentPriceThreshold] = useState("");
  const [thresholdType, setThresholdType] = useState("greater");
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const alarmSoundRef = useRef(null);

  const fetchCoinPrice = async (coinId) => {
    try {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=inr`);
      console.log(`Fetched price for ${coinId}: ₹${data[coinId]?.inr}`);
      return data[coinId]?.inr || null;
    } catch (error) {
      console.error("Error fetching coin price:", error);
      return null;
    }
  };

  const addCoinAlarm = () => {
    if (!currentCoin || !currentPriceThreshold) {
      alert("Please enter both coin and threshold price.");
      return;
    }
    const newAlarm = { 
      coinId: currentCoin.toLowerCase(), 
      priceThreshold: parseFloat(currentPriceThreshold),
      thresholdType 
    };
    setAlarms([...alarms, newAlarm]);
    setCurrentCoin("");
    setCurrentPriceThreshold("");
  };

  const deleteAlarm = (coinId) => {
    const updatedAlarms = alarms.filter(alarm => alarm.coinId !== coinId);
    setAlarms(updatedAlarms);
    console.log(`Deleted alarm for ${coinId}`);
  };

  const checkPricesAndTriggerAlarms = async () => {
    for (const { coinId, priceThreshold, thresholdType } of alarms) {
      const currentPrice = await fetchCoinPrice(coinId);
      if (currentPrice !== null) {
        let triggerAlarm = false;
        if (thresholdType === "greater" && currentPrice > priceThreshold) {
          triggerAlarm = true;
        } else if (thresholdType === "lesser" && currentPrice < priceThreshold) {
          triggerAlarm = true;
        }

        if (triggerAlarm) {
          console.log(`Price for ${coinId} ${thresholdType === "greater" ? "exceeded" : "fell below"} threshold! Current price: ₹${currentPrice}`);
          if (alarmEnabled) {
            playAlarm();
          }
        } else {
          console.log(`Price for ${coinId}: ₹${currentPrice}. ${thresholdType === "greater" ? "Below" : "Above"} the threshold of ₹${priceThreshold}.`);
        }
      }
    }
  };

  const playAlarm = () => {
    if (!alarmSoundRef.current) {
      alarmSoundRef.current = new Audio('/music2.mp3');
    }
    alarmSoundRef.current.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });
  };

  const stopAlarm = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.pause();
      alarmSoundRef.current.currentTime = 0;
    }
  };

  const enableAlarm = () => {
    setAlarmEnabled(true);
    console.log("Alarm sound enabled!");
  };

  const disableAlarm = () => {
    setAlarmEnabled(false);
    stopAlarm();
    console.log("Alarm sound disabled!");
  };

  useEffect(() => {
    if (alarms.length > 0 && alarmEnabled) {
      const intervalId = setInterval(checkPricesAndTriggerAlarms, 5000); 
      return () => clearInterval(intervalId);
    }
  }, [alarms, alarmEnabled]);

  return (
    <div className='container'>
      <h1 className='alarmHeader'>Crypto Price Notifier</h1>
      <p>Monitor multiple coins' prices...</p>

      <input
        type="text"
        className='alarmInput'
        placeholder="Coin ID (e.g., bitcoin, ethereum)"
        value={currentCoin}
        onChange={(e) => setCurrentCoin(e.target.value)}
      />
      <br />

      <input
        type="number"
        className='alarmInput'
        placeholder="Threshold price (in INR)"
        value={currentPriceThreshold}
        onChange={(e) => setCurrentPriceThreshold(e.target.value)}
      />
      <br />

      <select
        className='alarmInput' // Apply styling to select
        value={thresholdType}
        onChange={(e) => setThresholdType(e.target.value)}
      >
        <option value="greater">Greater than</option>
        <option value="lesser">Lesser than</option>
      </select>
      <br />

      <button className='alarmButton' onClick={addCoinAlarm}>Add Coin Alarm</button>

      <h3>Added Coins for Alarm:</h3>
      <ul className='alarmList'>
        {alarms.map((alarm, index) => (
          <li key={index} className='alarmListItem'>
            {alarm.coinId}: ₹{alarm.priceThreshold} ({alarm.thresholdType === "greater" ? "Greater than" : "Lesser than"})
            <button className='alarmListItemButton' onClick={() => deleteAlarm(alarm.coinId)}>Delete</button>
          </li>
        ))}
      </ul>

      <button className='alarmButton' onClick={enableAlarm} disabled={alarmEnabled}>
        Enable Alarm Sound
      </button>
      <button className='alarmButton' onClick={disableAlarm} disabled={!alarmEnabled}>
        Disable Alarm Sound
      </button>
    </div>
  );
};

export default CryptoAlarm;
