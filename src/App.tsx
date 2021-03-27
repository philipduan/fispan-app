import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  getLatestRate,
  getPastThirtyDaysRate,
  getMedianFromTimeSeries,
} from "./utils/utilities";
import "./App.scss";

function App() {
  const [rate, setRate] = useState<number>(0);
  const [rateMedian, setRateMedian] = useState<number>(0);

  useEffect(() => {
    getLatestRate("cad", "usd")
      .then((data) => {
        setRate(data.rates.USD);
      })
      .catch(({ message: errorMessage }) => {
        message.error(errorMessage);
      });

    getPastThirtyDaysRate("cad", "usd")
      .then((data) => {
        setRateMedian(getMedianFromTimeSeries(data.rates));
      })
      .catch(({ message: errorMessage }) => {
        message.error(errorMessage);
      });
  }, []);

  return (
    <div className="App">
      <p>1 CAD is {rate} to USD</p>
      <p>The rate median of CAD to USD for the last 30 days is {rateMedian}</p>
      <p>
        It is best to{" "}
        {rate < rateMedian ? "buy" : rate > rateMedian ? "sell" : "do nothing"}
      </p>
    </div>
  );
}

export default App;
