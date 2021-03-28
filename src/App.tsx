import React, { useState, useEffect } from "react";
import { Layout, message, Space, Switch, Typography } from "antd";
import {
  getLatestRate,
  getPastThirtyDaysRate,
  getMedianFromTimeSeries,
} from "./utils/utilities";
import "./App.scss";
import "antd/dist/antd.css";

const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

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
            <Paragraph>1 CAD is {rate} USD</Paragraph>
            <Paragraph>
              The rate median of CAD to USD for the last 30 days is {rateMedian}
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
          </Space>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
