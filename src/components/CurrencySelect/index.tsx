import React from "react";
import { Select } from "antd";

const { Option } = Select;

export interface CurrencySelectProps {
  selectedCurrency: string;
  currencies: string[];
  setCurrency: (currency: string) => void;
}

const CurrencySelect = ({
  selectedCurrency,
  currencies,
  setCurrency,
}: CurrencySelectProps) => (
  <Select
    style={{ margin: 10 }}
    defaultValue={selectedCurrency}
    onChange={(value) => {
      setCurrency(value);
    }}
  >
    {currencies.map((currency: string, index: number) => (
      <Option key={`${index}_${currency}`} value={currency}>
        {currency}
      </Option>
    ))}
  </Select>
);

export default CurrencySelect;
