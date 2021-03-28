import React, { useState, useEffect } from "react";
import moment from "moment";
import { Layout, message, Select, Space, Switch, Typography } from "antd";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
} from "react-vis";
import {
  getCurrencies,
  getLatestRate,
  getPastThirtyDaysRate,
  getMedianFromTimeSeries,
} from "./utils/utilities";
import "react-vis/dist/style.css";
import "antd/dist/antd.css";
import "./App.scss";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const App = () => {
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("CAD");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [rate, setRate] = useState<number>(0);
  const [rateMedian, setRateMedian] = useState<number>(0);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [chartData, setChartData] = useState<any>([]);

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
    if (rate < rateMedian) {
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
              <Select
                style={{ margin: 10 }}
                defaultValue={fromCurrency}
                onChange={(value) => {
                  setFromCurrency(value);
                }}
              >
                {currencyList.map((currency) => (
                  <Option value={currency}>{currency}</Option>
                ))}
              </Select>
              is {rate}
              <Select
                style={{ margin: 10 }}
                defaultValue={toCurrency}
                onChange={(value) => {
                  setToCurrency(value);
                }}
              >
                {currencyList.map((currency) => (
                  <Option value={currency}>{currency}</Option>
                ))}
              </Select>
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
            {chartData.length ? (
              <XYPlot
                xType="time"
                width={1000}
                height={500}
                margin={{ left: 60, right: 10, top: 10, bottom: 100 }}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis
                  title="Date"
                  tickLabelAngle={-45}
                  tickFormat={(tick) => moment(tick).format("DD-MM-YYYY")}
                />
                <YAxis title="Rate" tickLabelAngle={-45} />
                <MarkSeries data={chartData} strokeWidth={2} />
              </XYPlot>
            ) : (
              <></>
            )}
          </Space>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
