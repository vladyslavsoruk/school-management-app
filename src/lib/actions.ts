"use server";

import { v4 as uuidv4 } from "uuid";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Day } from "@prisma/client";
import {
  ClassSchema,
  SubjectSchema,
  TeacherSchema,
  StudentSchema,
  ExamSchema,
  ParentSchema,
  LessonSchema,
  AssignmentSchema,
  ResultSchema,
  AttendanceSchema,
  EventSchema,
  AnnouncementSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

// SUBJECT //

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// ATTENDANCE //

export const createAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        lessonId: data.lessonId,
        studentId: data.studentId,
      },
    });

    if (existingAttendance) {
      return { success: false, error: true };
    }

    await prisma.attendance.create({
      data: {
        lessonId: data.lessonId,
        present: data.present === "present",
        studentId: data.studentId,
        // date: new Date(),
        date: data.date,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {
  try {
    await prisma.attendance.update({
      where: {
        id: data.id,
      },
      data: {
        lessonId: data.lessonId,
        present: data.present === "present",
        studentId: data.studentId,
        date: data.date,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.attendance.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// EVENT //

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId === 0 ? null : data.classId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId === 0 ? null : data.classId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// ANNOUNCEMENT //

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId === 0 ? null : data.classId,
        date: data.date,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId === 0 ? null : data.classId,
        date: data.date,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// LESSON

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    let day = null;
    if (data.startTime.getDay() >= 1 && data.startTime.getDay() <= 5) {
      const d = daysOfWeek[data.startTime.getDay() - 1];
      day = Day[d as keyof typeof Day];
    } else {
      return { success: false, error: true };
    }

    await prisma.lesson.create({
      data: {
        name: data.name,
        day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId.toString(),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    let day = null;
    if (data.startTime.getDay() >= 1 && data.startTime.getDay() <= 5) {
      const d = daysOfWeek[data.startTime.getDay() - 1];
      day = Day[d as keyof typeof Day];
    } else {
      return { success: false, error: true };
    }

    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId.toString(),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// RESULT

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    const existingResult = await prisma.result.findFirst({
      where: {
        studentId: data.studentId,
        examId: data.resultType === "exam" ? data.examId : null,
        assignmentId:
          data.resultType === "assignment" ? data.assignmentId : null,
      },
    });

    if (existingResult) {
      return { success: false, error: true };
    }

    console.log("DATA for Result", data);

    await prisma.result.create({
      data: {
        examId: data.resultType === "exam" ? data.examId : null,
        assignmentId:
          data.resultType === "assignment" ? data.assignmentId : null,
        studentId: data.studentId.toString(),
        score: data.score,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        examId: data.resultType === "exam" ? data.examId : null,
        assignmentId:
          data.resultType === "assignment" ? data.assignmentId : null,
        studentId: data.studentId.toString(),
        score: data.score,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// CLASS //

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// TEACHER //

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    // const client = await clerkClient();

    // const response = await client.users.createUser({
    //   username: data.username,
    //   password: data.password,
    //   firstName: data.name,
    //   lastName: data.surname,
    //   publicMetadata: {
    //     role: "teacher",
    //   },
    // });

    await prisma.teacher.create({
      data: {
        id: uuidv4(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
        birthday: data.birthday,
        img: data.img,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    if (!data.id) {
      return { success: false, error: true };
    }
    // const client = await clerkClient();

    // await client.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password !== "" && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        sex: data.sex,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
        birthday: data.birthday,
        img: data.img,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // const client = await clerkClient();
    // await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// STUDENT //

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { error: true, success: false };
    }

    // const client = await clerkClient();

    // const response = await client.users.createUser({
    //   username: data.username,
    //   password: data.password,
    //   firstName: data.name,
    //   lastName: data.surname,
    //   publicMetadata: {
    //     role: "student",
    //   },
    // });

    await prisma.student.create({
      data: {
        id: uuidv4(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        img: data.img,
        gradeId: data.gradeId,
        parentId: data.parentId,
        classId: data.classId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    if (!data.id) {
      return { success: false, error: true };
    }
    // const client = await clerkClient();

    // await client.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password !== "" && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        img: data.img,
        gradeId: data.gradeId,
        parentId: data.parentId,
        classId: data.classId,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // const client = await clerkClient();
    // await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// PARENT //
export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    // const client = await clerkClient();

    // const response = await client.users.createUser({
    //   username: data.username,
    //   password: data.password,
    //   firstName: data.name,
    //   lastName: data.surname,
    //   publicMetadata: {
    //     role: "parent",
    //   },
    // });

    await prisma.parent.create({
      data: {
        id: uuidv4(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    if (!data.id) {
      return { success: false, error: true };
    }
    // const client = await clerkClient();

    // await client.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password !== "" && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    // const client = await clerkClient();
    // await client.users.deleteUser(id);

    // Also delete child of the parent from DB
    const children = await prisma.student.findMany({
      where: {
        parentId: id,
      },
      select: {
        id: true,
      },
    });
    for (const child of children) {
      await prisma.student.delete({
        where: {
          id: child.id,
        },
      });
      // await client.users.deleteUser(child.id);
    }

    await prisma.parent.delete({
      where: {
        id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// EXAM //

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          id: data.lessonId,
          teacherId: currentUserId!,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          id: data.lessonId,
          teacherId: currentUserId!,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher"
          ? { lesson: { teacherId: currentUserId! } }
          : {}),
      },
    });
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

// ASSIGNMENT //

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          id: data.lessonId,
          teacherId: currentUserId!,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.create({
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startDate: data.startDate,
        dueDate: data.dueDate,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          id: data.lessonId,
          teacherId: currentUserId!,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        lessonId: data.lessonId,
        startDate: data.startDate,
        dueDate: data.dueDate,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const authObject = await auth();
    const currentUserId = authObject.userId;
    const role = (authObject.sessionClaims?.metadata as { role: string })?.role;

    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher"
          ? { lesson: { teacherId: currentUserId! } }
          : {}),
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.error(error);
    return { success: false, error: true };
  }
};
