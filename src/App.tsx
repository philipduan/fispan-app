import React, { useState, useEffect } from "react";
import { message, Switch } from "antd";
import {
  getLatestRate,
  getPastThirtyDaysRate,
  getMedianFromTimeSeries,
} from "./utils/utilities";
import "./App.scss";
import "antd/dist/antd.css";

const App = () => {
  const [rate, setRate] = useState<number>(0);
  const [rateMedian, setRateMedian] = useState<number>(0);
  const [isBuy, setIsBuy] = useState<boolean>(true);

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

  const buySellToggleChange = () => {
    setIsBuy((isPrevIsBuy) => !isPrevIsBuy);
  };

  const goodOrNot = () => {
    if (rate < rateMedian) {
      return isBuy ? "good" : "not good";
    } else {
      return isBuy ? "not good" : "good";
    }
  };

  return (
    <div className="App">
      <p>1 CAD is {rate} to USD</p>
      <p>The rate median of CAD to USD for the last 30 days is {rateMedian}</p>
      <Switch
        defaultChecked={isBuy}
        checkedChildren="Buy"
        unCheckedChildren="Sell"
        onChange={buySellToggleChange}
      />
      <p>
        It's {goodOrNot()} to {isBuy ? "buy" : "sell"}
      </p>
    </div>
  );
};

export default App;
