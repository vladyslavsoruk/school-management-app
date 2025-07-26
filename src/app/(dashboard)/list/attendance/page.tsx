import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Attendance, Class, Prisma, Student, Subject } from "@prisma/client";
import Image from "next/image";

let role: string | null = null;

type AttendanceList = Attendance & {
  lesson: { subject: Subject };
  student: { student: Student; class: Class };
};

type ResultDataList = {
  id: number;
  date: Date;
  present: Boolean;
  studentName: string;
  studentSurname: string;
  subjectName: string;
  className: string;
};

const columns = [
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Subject",
    accessor: "subject",
    className: "hidden md:table-cell",
  },
  {
    header: "Present",
    accessor: "present",
  },
  { header: "Date", accessor: "date", className: "hidden sm:table-cell" },

  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: ResultDataList) => {
  return (
    <tr
      key={item.id}
      className="text-xs border-b border-gray-200 even:bg-slate-50 hover:bg-customPurpleLight"
    >
      <td className="p-4">{item.studentName + " " + item.studentSurname}</td>
      <td className="hidden md:table-cell">{item.className}</td>
      <td className="hidden md:table-cell">{item.subjectName}</td>
      <td>
        {item.present ? (
          <span className="text-green-500">present</span>
        ) : (
          <span className="text-red-500">absent</span>
        )}
      </td>
      <td className="hidden sm:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(item.date).replace(/\//g, ".")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table={"attendance"} type={"update"} data={item} />
              <FormContainer
                table={"attendance"}
                type={"delete"}
                id={item.id}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

async function AttendanceList({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const authObject = await auth();
  const currentUserId = authObject.userId;
  role = (authObject.sessionClaims?.metadata as { role: string })?.role;

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.AttendanceWhereInput = {};

  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // case "teacherId":
          //   query.lesson = {
          //     teacherId: value,
          //   };
          //   break;
          //   case "studentId":
          //     query.studentId = value;
          //     break;
          case "search":
            query.OR = [
              {
                lesson: {
                  subject: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
              {
                student: {
                  OR: [
                    { name: { contains: value, mode: "insensitive" } },
                    { surname: { contains: value, mode: "insensitive" } },
                  ],
                },
              },
              {
                student: {
                  class: {
                    name: { contains: value, mode: "insensitive" },
                  },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson = { teacherId: currentUserId! };
      break;
    case "student":
      query.studentId = currentUserId!;
      break;
    case "parent":
      query.student = { parentId: currentUserId! };
      break;

    default:
      break;
  }

  // Show attendance from Monday
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  lastMonday.setHours(0, 0, 0, 100);

  query.date = {
    gte: lastMonday,
  };

  const [dataResponse, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
        lesson: {
          select: {
            id: true,
            startTime: true,
            subject: {
              select: {
                name: true,
              },
            },
            class: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
      orderBy: { date: "desc" },
    }),
    prisma.attendance.count({ where: query }),
  ]);

  const data = dataResponse.map((item) => {
    return {
      id: item.id,
      date: item.date,
      lessonId: item.lesson.id,
      studentId: item.student.id,
      present: item.present,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      subjectName: item.lesson.subject.name,
      className: item.lesson.class.name,
      lesson: item.lesson,
    };
  });

  return (
    <div className="bg-white p-4 m-4 mt-0 rounded-md flex-1">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Attendance
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormContainer table={"attendance"} type={"create"} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={data} />
      </div>
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
}

export default AttendanceList;
