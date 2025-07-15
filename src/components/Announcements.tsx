import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Prisma } from "@prisma/client";

let role: string | null = null;

async function Announcements() {
  const authObject = await auth();
  const currentUserId = authObject.userId;
  role = (authObject.sessionClaims?.metadata as { role: string })?.role;

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId } } },
    student: { students: { some: { id: currentUserId } } },
    parent: { students: { some: { parentId: currentUserId } } },
  };

  const accessFilters: Prisma.AnnouncementWhereInput[] = [{ classId: null }];

  if (role !== "admin") {
    const classFilter = roleConditions[role as keyof typeof roleConditions];
    if (classFilter) {
      accessFilters.push({ class: classFilter as Prisma.ClassWhereInput });
    }
  }

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: role !== "admin" ? { OR: accessFilters } : {},
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View all</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-customSkyLight rounded-md p-4 ">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-customPurpleLight rounded-md p-4 ">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-customYellowLight rounded-md p-4 ">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md p-1">
                {new Intl.DateTimeFormat("en-GB").format(data[2].date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
