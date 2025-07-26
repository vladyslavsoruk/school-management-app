import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";
import { log } from "console";

async function AttendanceChartContainer() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  lastMonday.setHours(0, 0, 0, 100);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });
  console.log("RESDATA:", resData);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDayOfWeek = new Date(item.date).getDay();

    if (itemDayOfWeek >= 1 && itemDayOfWeek <= 5) {
      const dayName = daysOfWeek[itemDayOfWeek - 1];
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });
  console.log(attendanceMap);

  // const data = daysOfWeek.map((day) => ({
  //   name: day,
  //   present: attendanceMap[day].present,
  //   absent: attendanceMap[day].absent,
  // }));

  const data = [
    { name: "Mon", present: 44, absent: 6 },
    { name: "Tue", present: 46, absent: 4 },
    { name: "Wed", present: 45, absent: 5 },
    { name: "Thu", present: 45, absent: 5 },
    { name: "Fri", present: 46, absent: 4 },
  ];

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-lg font-semibold ">Attendance</h1>
        <Image
          src={"/moreDark.png"}
          alt="moreDark.png"
          width={20}
          height={20}
        />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
}

export default AttendanceChartContainer;
