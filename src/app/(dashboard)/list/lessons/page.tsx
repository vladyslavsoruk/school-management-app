import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Class, Lesson, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

let role: string | null = null;

type LessonsList = Lesson & { class: Class } & { teacher: Teacher } & {
  subject: Subject;
};

const renderRow = (item: LessonsList) => {
  return (
    <tr
      key={item.id}
      className="text-xs border-b border-gray-200 even:bg-slate-50 hover:bg-customPurpleLight"
    >
      <td className="flex items-center p-4">
        <h3 className="font-semibold">{item.subject.name}</h3>
      </td>
      <td>{item.class.name}</td>
      <td className="hidden md:table-cell">
        {item.teacher.name + " " + item.teacher.surname}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.getHours() +
          ":" +
          item.startTime.getMinutes() +
          " - " +
          item.endTime.getHours() +
          ":" +
          item.endTime.getMinutes()}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table={"lesson"} type={"update"} data={item} />
              <FormModal table={"lesson"} type={"delete"} id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

async function LessonsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const authObject = await auth();
  const currentUserId = authObject.userId;
  role = (authObject.sessionClaims?.metadata as { role: string })?.role;

  console.log("currentUserId:", currentUserId);
  console.log("role:", role);

  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Time",
      accessor: "time",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};

  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.teacherId = value;
            break;
          case "classId":
            query.classId = parseInt(value);
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              {
                teacher: {
                  OR: [
                    { name: { contains: value, mode: "insensitive" } },
                    { surname: { contains: value, mode: "insensitive" } },
                  ],
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
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.teacherId = currentUserId!;
      // query.startTime = {
      //   gte: todayDate,
      // };
      break;
    case "student":
      query.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      // query.startTime = {
      //   gte: todayDate,
      // };
      break;
    case "parent":
      query.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      // query.startTime = {
      //   gte: todayDate,
      // };
      break;

    default:
      break;
  }

  const [lessons, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        teacher: { select: { name: true, surname: true } },
        class: { select: { name: true } },
        subject: { select: { name: true } },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
      orderBy: {
        startTime: "desc",
      },
    }),
    prisma.lesson.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 m-4 mt-0 rounded-md flex-1">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
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
              <>
                <FormContainer table={"lesson"} type={"create"} />
              </>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={lessons} />
      </div>
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
}

export default LessonsList;
