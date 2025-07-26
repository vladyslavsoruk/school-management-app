import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Announcement, Class, Prisma } from "@prisma/client";
import Image from "next/image";

// const { sessionClaims } = await auth();
// const role = (sessionClaims?.metadata as { role: string })?.role;

let role: string | null = null;

// async function getRole() {
//   let authData = await auth();
//   role = authData?.sessionClaims?.metadata?.role;
//   console.log("Value:::::!!!!", role);
// }();

type AnnouncementList = Announcement & { class: Class };
const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },

  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: AnnouncementList) => {
  console.log("VALUE in renderRow:", role);

  return (
    <tr
      key={item.id}
      className="text-xs border-b border-gray-200 even:bg-slate-50 hover:bg-customPurpleLight"
    >
      <td className="p-4">
        <h3 className="font-semibold">{item.title}</h3>
      </td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(item.date).replace(/\//g, ".")}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer
                table={"announcement"}
                type={"update"}
                data={item}
              />
              <FormContainer
                table={"announcement"}
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

async function AnnouncementList({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const authObject = await auth();
  const currentUserId = authObject.userId;
  role = (authObject.sessionClaims?.metadata as { role: string })?.role;

  console.log("currentUserId:", currentUserId);

  auth().then((value) => {
    role = (value.sessionClaims?.metadata as { role: string })?.role;
    console.log("VALUE!!!", role);
  });

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};

  // URL PARAMS CONDITIONS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  const roleConditions = {
    admin: {},
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  // {
  //   role === "admin"
  //     ? null
  //     : (query.OR = [
  //         { classId: null },
  //         {
  //           class: { is: roleConditions[role as keyof typeof roleConditions] },
  //         },
  //       ]);
  // }

  query.OR = [
    { classId: null },
    { class: { is: roleConditions[role as keyof typeof roleConditions] } },
  ];

  console.log("query:", query);

  const [announcements, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: true,
      },
      orderBy: { date: "desc" },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 m-4 mt-0 rounded-md flex-1">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Announcements
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
            {role === "admin" && (
              <FormContainer table={"announcement"} type={"create"} />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <div>
        <Table columns={columns} renderRow={renderRow} data={announcements} />
      </div>
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
}

export default AnnouncementList;
