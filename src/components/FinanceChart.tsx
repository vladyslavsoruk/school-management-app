"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 3000,
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3200,
    expense: 2000,
  },
  {
    name: "Mar",
    income: 3500,
    expense: 1800,
  },
  {
    name: "Apr",
    income: 3800,
    expense: 1750,
  },
  {
    name: "May",
    income: 3600,
    expense: 1800,
  },
  {
    name: "Jun",
    income: 3900,
    expense: 1700,
  },
  // {
  //   name: "Jul",
  //   income: 3490,
  //   expense: 4300,
  // },
  // {
  //   name: "Aug",
  //   income: 3490,
  //   expense: 4300,
  // },
  // {
  //   name: "Sep",
  //   income: 3490,
  //   expense: 4300,
  // },
  // {
  //   name: "Oct",
  //   income: 3490,
  //   expense: 4300,
  // },
  // {
  //   name: "Nov",
  //   income: 3490,
  //   expense: 4300,
  // },
  // {
  //   name: "Dec",
  //   income: 3490,
  //   expense: 4300,
  // },
];

function FinanceChart() {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-lg font-semibold ">Finances</h1>
        <Image
          src={"/moreDark.png"}
          alt="moreDark.png"
          width={20}
          height={20}
        />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#CFCEFF"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FinanceChart;
