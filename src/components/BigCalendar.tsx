"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const localizer = momentLocalizer(moment);

function BigCalendar({
  data,
}: {
  data: { title: string; start: Date; end: Date }[];
}) {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const schedule = adjustScheduleToCurrentWeek(data);
  console.log("Schedule data:", data);
  console.log("Schedule:", schedule);

  return (
    <Calendar
      localizer={localizer}
      events={schedule}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "95%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 0, 10, 8, 0, 0)}
      max={new Date(2025, 1, 10, 17, 0, 0)}
    />
  );
}

export default BigCalendar;

// "use client";

// import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
// import moment from "moment";
// import { calendarEvents } from "@/lib/data";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useState } from "react";

// const localizer = momentLocalizer(moment);

// const BigCalendar = () => {
//   const [view, setView] = useState<View>(Views.WORK_WEEK);

//   const handleOnChangeView = (selectedView: View) => {
//     setView(selectedView);
//   };

//   return (
//     <Calendar
//       localizer={localizer}
//       events={calendarEvents}
//       startAccessor="start"
//       endAccessor="end"
//       views={["work_week", "day"]}
//       view={view}
//       style={{ height: "98%" }}
//       onView={handleOnChangeView}
//       min={new Date(2025, 1, 0, 8, 0, 0)}
//       max={new Date(2025, 1, 0, 17, 0, 0)}
//     />
//   );
// };

// export default BigCalendar;
