import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()),
});

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  subjectId: z.coerce.number({ message: "Subject is required!" }),
  name: z.string().min(1, { message: "Lesson title is required!" }),
  classId: z.coerce.number({ message: "Teacher is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  teacherId: z.string().nonempty({ message: "Teacher is required!" }),
});

export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
  present: z.enum(["present", "absent"], {
    message: "Present/absent is required!",
  }),
  studentId: z.string().nonempty({ message: "Student is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
});

export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Exam title is required!" }),
  description: z.string().min(1, { message: "Exam description is required!" }),
  classId: z.coerce.number({ message: "Class is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
});

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Announcement title is required!" }),
  description: z
    .string()
    .min(1, { message: "Announcement description is required!" }),
  classId: z.coerce.number({ message: "Class is required!" }),
  date: z.coerce.date({ message: "Date is required!" }),
});

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Exam title is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Assignment title is required!" }),
  startDate: z.coerce.date({ message: "Start date is required!" }),
  dueDate: z.coerce.date({ message: "Due date is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  resultType: z.enum(["exam", "assignment"], {
    message: "Result type is required!",
  }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string().min(1, { message: "Particular student is required!" }),
  score: z.coerce
    .number({ message: "Score is required!" })
    .min(1, { message: "Score must be at least 1" })
    .max(100, { message: "Score must be at most 100" }),
});

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Capacity is required!" }),
  capacity: z.coerce
    .number()
    .min(1, { message: "Class name is required!" })
    .max(44, { message: "Capacity should be less than 45" }),
  gradeId: z.coerce
    .number()
    .min(1, { message: "Grade is required!" })
    .max(12, { message: "Grade should be less than 13" }),
  supervisorId: z.coerce.string().optional(),
});

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  //   img: z.any().refine((files) => files?.[0], { message: "Image is required!" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), // Subject ids are stored
});

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: z.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required!" }),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;
export type ExamSchema = z.infer<typeof examSchema>;
export type LessonSchema = z.infer<typeof lessonSchema>;
export type ClassSchema = z.infer<typeof classSchema>;
export type TeacherSchema = z.infer<typeof teacherSchema>;
export type StudentSchema = z.infer<typeof studentSchema>;
export type ParentSchema = z.infer<typeof parentSchema>;
export type AssignmentSchema = z.infer<typeof assignmentSchema>;
export type ResultSchema = z.infer<typeof resultSchema>;
export type AttendanceSchema = z.infer<typeof attendanceSchema>;
export type EventSchema = z.infer<typeof eventSchema>;
export type AnnouncementSchema = z.infer<typeof announcementSchema>;
