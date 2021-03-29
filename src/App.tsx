import React, { useState, useEffect } from "react";
import { Layout, message, Space, Switch, Typography } from "antd";
import {
  getCurrencies,
  getLatestRate,
  getPastThirtyDaysRate,
  getMedianFromTimeSeries,
} from "./utils/utilities";
import SimpleScatterChart, { ChartData } from "./components/SimpleScatterChart";
import CurrencySelect from "./components/CurrencySelect";
import "antd/dist/antd.css";
import "./App.scss";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const App = () => {
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("CAD");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [rate, setRate] = useState<number>(0);
  const [rateMedian, setRateMedian] = useState<number>(0);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    getCurrencies()
      .then((data) => {
        setCurrencyList(Object.keys(data));
      })
      .catch(({ message: errorMessage }) => {
        showErrorMessage(errorMessage);
      });
  }, []);

  useEffect(() => {
    getLatestRate(fromCurrency, toCurrency)
      .then((data) => {
        setRate(data.rates[toCurrency]);
      })
      .catch(({ message: errorMessage }) => {
        showErrorMessage(errorMessage);
      });

    getPastThirtyDaysRate(fromCurrency, toCurrency)
      .then((data) => {
        setChartData(
          Object.entries(data.rates).map(([key, value]) => ({
            x: new Date(key),
            y: value[toCurrency],
          }))
        );
        setRateMedian(getMedianFromTimeSeries(toCurrency, data.rates));
      })
      .catch(({ message: errorMessage }) => {
        showErrorMessage(errorMessage);
      });
  }, [fromCurrency, toCurrency]);

  const showErrorMessage = (errorMessage: string) => {
    message.error(errorMessage);
  };

  const buySellToggleChange = () => {
    setIsBuy((isPrevIsBuy) => !isPrevIsBuy);
  };

  const goodOrNot = () => {
    if (rate === rateMedian) {
      return "not good";
    } else if (rate < rateMedian) {
      return isBuy ? "good" : "not good";
    } else {
      return isBuy ? "not good" : "good";
    }
  };

  return (
    <div className="App">
      <Layout>
        <Header>
          <Title style={{ color: "#FFFFFF", textAlign: "center" }}>
            Currency Conversion App
          </Title>
        </Header>
        <Content
          style={{ padding: 10, display: "flex", justifyContent: "center" }}
        >
          <Space direction="vertical" align="center">
            <Paragraph>
              1
              <CurrencySelect
                selectedCurrency={fromCurrency}
                currencies={currencyList}
                setCurrency={setFromCurrency}
              />
              is {rate}
              <CurrencySelect
                selectedCurrency={toCurrency}
                currencies={currencyList}
                setCurrency={setToCurrency}
              />
            </Paragraph>
            <Paragraph>
              The rate median of {fromCurrency} to {toCurrency} for the last 30
              days is {rateMedian}
            </Paragraph>
            <Switch
              defaultChecked={isBuy}
              checkedChildren="Buy"
              unCheckedChildren="Sell"
              onChange={buySellToggleChange}
              style={{ marginBottom: 10 }}
            />
            <Paragraph>
              It's {goodOrNot()} to {isBuy ? "buy" : "sell"}
            </Paragraph>
            <SimpleScatterChart chartData={chartData} />
          </Space>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
