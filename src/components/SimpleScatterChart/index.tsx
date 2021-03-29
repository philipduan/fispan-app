import React from "react";
import moment from "moment";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
} from "react-vis";
import "react-vis/dist/style.css";

export interface ChartData {
  x: Date;
  y: number;
}
export interface SimpleScatterChartProps {
  chartData: ChartData[];
}

const SimpleScatterChart = ({ chartData }: SimpleScatterChartProps) =>
  chartData.length ? (
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
  );

export default SimpleScatterChart;
