"use client";

import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useRouter } from "next/navigation";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

function EventCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter();

  useEffect(() => {
    if (value instanceof Date) {
      const month = String(value.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(value.getDate()).padStart(2, "0");
      const year = value.getFullYear();

      router.push(`?date=${month}/${day}/${year}`);
      // router.push(
      //   `?date=${value.toLocaleDateString("en-US", {
      //     month: "2-digit",
      //     day: "2-digit",
      //     year: "numeric",
      //   })}`
      // );
    }
  }, [value, router]);

  return <Calendar onChange={onChange} value={value} locale="en-US" />;
}

export default EventCalendar;
