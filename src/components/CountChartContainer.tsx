import Image from "next/image";
import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

async function CountChartContainer() {
  const data = await prisma.student.groupBy({
    by: ["sex"],
    _count: true,
  });
  console.log(data);

  const boysQuantity = data.find((val) => val.sex === "MALE")?._count || 0;
  const girlsQuantity = data.find((val) => val.sex === "FEMALE")?._count || 0;

  const boysPercentage = Math.round(
    (boysQuantity / (boysQuantity + girlsQuantity)) * 100
  );
  const girlsPercentage = Math.round(
    (girlsQuantity / (boysQuantity + girlsQuantity)) * 100
  );

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="moreDark.png" width={20} height={20} />
      </div>
      <CountChart boys={boysQuantity} girls={girlsQuantity} />
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-customSky rounded-full"></div>
          <h1 className="font-bold">{boysQuantity}</h1>
          <h2 className="text-xs text-gray-500">Boys ({boysPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-customYellow rounded-full"></div>
          <h1 className="font-bold">{girlsQuantity}</h1>
          <h2 className="text-xs text-gray-500">Girls ({girlsPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
}

export default CountChartContainer;
