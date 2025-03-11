import AttendanceChart from "@/components/AttendanceChart";
import Chart from "@/components/CountChart";
import FinanceChart from "@/components/FinanceChart";
import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UserCard";
import Announcements from "@/components/Announcements";

function AdminPage() {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT  */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User Cards  */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        {/* CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT Chart  */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <Chart />
          </div>
          {/* Attendance Chart  */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* Finance Chart  */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* Calendar*/}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}

export default AdminPage;
