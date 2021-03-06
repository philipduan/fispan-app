import axios from "axios";
import moment from "moment";
import { LatestResponse, Rates, TimeSeriesResponse } from "./interface";

export const baseUrl = "https://api.frankfurter.app";

export const getCurrencies = async (): Promise<Record<string, string>> => {
  try {
    const currenciesResponse = await axios.get(`${baseUrl}/currencies`);
    return currenciesResponse.data;
  } catch (e) {
    throw new Error("Cannot get currencies");
  }
};
export const getLatestRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<LatestResponse> => {
  try {
    const lastestResponse = await axios.get<LatestResponse>(
      `${baseUrl}/latest?from=${fromCurrency}&to=${toCurrency}`
    );
    return lastestResponse.data;
  } catch (error) {
    throw new Error("Cannot get latest rate");
  }
};

export const getPastThirtyDaysRate = async (
  fromCurrency: string,
  toCurrency: string
): Promise<TimeSeriesResponse> => {
  try {
    const dateToday = moment().format("yyyy-MM-DD");
    const dateThirtyDaysBefore = moment()
      .subtract(30, "days")
      .format("yyyy-MM-DD");
    const pastThirtyDaysRateResponse = await axios.get(
      `${baseUrl}/${dateThirtyDaysBefore}..${dateToday}?from=${fromCurrency}&to=${toCurrency}`
    );
    return pastThirtyDaysRateResponse.data;
  } catch (error) {
    throw new Error("Cannot get past 30 days rate");
  }
};

export const getMedianFromTimeSeries = (
  toCurrency: string,
  rates: Record<string, Rates>
): number => {
  let medianRate: number = 0;
  const ratesArray = Object.values(rates)
    .map((rate) => rate[toCurrency])
    .sort();
  const middleArray = Math.floor(ratesArray.length / 2);
  if (middleArray % 2 === 0) {
    medianRate = (ratesArray[middleArray - 1] + ratesArray[middleArray]) / 2;
  } else {
    medianRate = ratesArray[middleArray];
  }
  return +medianRate.toFixed(4);
};
