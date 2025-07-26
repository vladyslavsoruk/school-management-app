import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

async function FormContainer({ table, type, data, id }: FormContainerProps) {
  let relatedData = {};
  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: {
            id: true,
            name: true,
            surname: true,
          },
        });
        relatedData = { grades: classGrades, teachers: classTeachers };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        });
        relatedData = { subjects: teacherSubjects };
        break;
      case "student":
        const grades = await prisma.grade.findMany({
          select: {
            id: true,
            level: true,
          },
        });
        const classes = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
            capacity: true,
            _count: { select: { students: true } },
          },
        });
        relatedData = { grades, classes };
        break;
      case "exam":
        const authObject = await auth();
        const role = (authObject.sessionClaims?.metadata as { role: string })
          ?.role;
        const currentUserId = authObject.userId;

        const lessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: {
            id: true,
            name: true,
            class: { select: { name: true } },
            subject: { select: { name: true } },
          },
        });
        relatedData = { lessons };
        break;
      case "assignment":
        const authObjectForAssignment = await auth();
        const roleForAssignment = (
          authObjectForAssignment.sessionClaims?.metadata as { role: string }
        )?.role;
        const currentUserIdForAssignment = authObjectForAssignment.userId;

        const lessonsForAssignment = await prisma.lesson.findMany({
          where: {
            ...(roleForAssignment === "teacher"
              ? { teacherId: currentUserIdForAssignment! }
              : {}),
          },
          select: {
            id: true,
            name: true,
            class: { select: { name: true } },
            subject: { select: { name: true } },
          },
        });
        relatedData = { lessons: lessonsForAssignment };
        break;
      case "lesson":
        const authObjectForLesson = await auth();
        const roleForLesson = (
          authObjectForLesson.sessionClaims?.metadata as { role: string }
        )?.role;
        const currentUserIdForLesson = authObjectForLesson.userId;

        const lessonTeachers = await prisma.teacher.findMany({
          where: {
            ...(roleForLesson === "teacher"
              ? {
                  id: currentUserIdForLesson!,
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
            surname: true,
            subjects: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        const lessonSubjects = await prisma.subject.findMany({
          where: {
            ...(roleForLesson === "teacher"
              ? {
                  teachers: { some: { id: currentUserIdForLesson! } },
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
          },
        });

        const lessonClasses = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = {
          teachers: lessonTeachers,
          subjects: lessonSubjects,
          classes: lessonClasses,
        };
        break;

      case "result":
        const authObjectForResult = await auth();
        const roleForResult = (
          authObjectForResult.sessionClaims?.metadata as { role: string }
        )?.role;
        const currentUserIdForResult = authObjectForResult.userId;

        const examsForResult = await prisma.exam.findMany({
          where: {
            ...(roleForResult === "teacher"
              ? {
                  lesson: { teacherId: currentUserIdForResult! },
                }
              : {}),
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                class: { select: { id: true, name: true } },
              },
            },
            results: {
              select: {
                studentId: true,
              },
            },
          },
        });

        const assignmentsForResult = await prisma.assignment.findMany({
          where: {
            ...(roleForResult === "teacher"
              ? {
                  lesson: { teacherId: currentUserIdForResult! },
                }
              : {}),
          },
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                class: { select: { id: true, name: true } },
              },
            },
            results: {
              select: {
                studentId: true,
              },
            },
          },
        });

        const studentsForResult = await prisma.student.findMany({
          where: {
            ...(roleForResult === "teacher"
              ? {
                  class: {
                    lessons: {
                      some: { teacherId: currentUserIdForResult! },
                    },
                  },
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
            surname: true,
            classId: true,
          },
        });

        relatedData = {
          exams: examsForResult,
          assignments: assignmentsForResult,
          students: studentsForResult,
        };
        break;

      case "attendance":
        const authObjectForAttendance = await auth();
        const roleForAttendance = (
          authObjectForAttendance.sessionClaims?.metadata as { role: string }
        )?.role;
        const currentUserIdForAttendance = authObjectForAttendance.userId;

        const lessonsForAttendance = await prisma.lesson.findMany({
          where: {
            ...(roleForAttendance === "teacher"
              ? {
                  teacherId: currentUserIdForAttendance!,
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
            startTime: true,
            subject: { select: { name: true } },
            class: { select: { id: true, name: true } },
            attendances: {
              select: {
                studentId: true,
              },
            },
          },
        });

        const studentsForAttendance = await prisma.student.findMany({
          where: {
            ...(roleForAttendance === "teacher"
              ? {
                  class: {
                    lessons: {
                      some: { teacherId: currentUserIdForAttendance! },
                    },
                  },
                }
              : {}),
          },
          select: {
            id: true,
            name: true,
            surname: true,
            classId: true,
          },
        });

        relatedData = {
          lessons: lessonsForAttendance,
          students: studentsForAttendance,
        };
        break;

      case "event":
        const classesForEvent = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = {
          classes: classesForEvent,
        };
        break;
      case "announcement":
        const classesForAnnouncement = await prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        });

        relatedData = {
          classes: classesForAnnouncement,
        };
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
}

export default FormContainer;
