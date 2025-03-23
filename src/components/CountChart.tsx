"use client";
import Image from "next/image";
import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarRadiusAxis,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function CountChart({
  boys,
  girls,
}: {
  boys: number;
  girls: number;
}) {
  const data = [
    {
      name: "Total",
      count: boys + girls,
      fill: "white",
    },
    {
      name: "Girls",
      count: girls,
      fill: "rgb(250, 226, 124)",
    },
    {
      name: "Boys",
      count: boys,
      fill: "rgb(195, 235, 250)",
    },
  ];
  return (
    <div className="relative w-full h-[75%]">
      <Image
        src={"/maleFemale.png"}
        alt="maleFemale"
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]"
      />
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
