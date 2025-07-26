"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import {
  attendanceSchema,
  AttendanceSchema,
} from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { toLocalDatetimeInputValue } from "@/lib/utils";

function AttendanceForm({
  setOpen,
  type,
  data,
  relatedData,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const { lessons, students } = relatedData;

  const [relatedStudents, setRelatedStudents] = useState(students);
  const [attendanceDate, setAttendanceDate] = useState(undefined);

  const attendanceAction =
    type === "create" ? createAttendance : updateAttendance;

  const [state, formAction] = useFormState(attendanceAction, {
    success: false,
    error: false,
  });

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted with data");
  // };

  const onSubmit = handleSubmit((d) => {
    console.log("HELLO from react-hook-form!!!");
    console.log(d);
    formAction(d);
  });

  const router = useRouter();

  useEffect(() => {
    state.success && toast(`Attendance was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  // Teachers that can be assigned to the lesson on particular subject
  useEffect(() => {
    const lessonId = data?.lessonId || lessons[0]?.id;

    const existingLesson = lessons.find(
      (l: { id: number }) => l.id === lessonId
    );

    const classId = existingLesson?.class.id;

    if (students && classId) {
      const studentsAttendingLesson = existingLesson.attendances.map(
        (a: { studentId: string }) => a.studentId
      );
      console.log("studentsAttendingLesson", studentsAttendingLesson);

      // Filter students based on the class they belong to
      let filteredStudents = [];
      if (type === "create") {
        filteredStudents = students.filter(
          (s: { id: string; classId: number }) =>
            s.classId === classId && !studentsAttendingLesson.includes(s.id)
        );
      } else {
        filteredStudents = students.filter(
          (s: { classId: number }) => s.classId === classId
        );
      }

      console.log("filteredStudents", filteredStudents);

      setRelatedStudents(filteredStudents);
    }
    setValue("date", data?.startTime || existingLesson?.startTime);
    setAttendanceDate(data?.startTime || existingLesson?.startTime);
  }, [students]);

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lessonId = parseInt(e.target.value);

    const existingLesson = lessons.find(
      (l: { id: number }) => l.id === lessonId
    );
    const classId = existingLesson?.class.id;

    if (students && classId) {
      const studentsAttendingLesson = existingLesson.attendances.map(
        (a: { studentId: string }) => a.studentId
      );
      console.log("studentsAttendingLesson", studentsAttendingLesson);

      // Filter students based on the class they belong to
      let filteredStudents = [];
      if (type === "create") {
        filteredStudents = students.filter(
          (s: { id: string; classId: number }) =>
            s.classId === classId && !studentsAttendingLesson.includes(s.id)
        );
      } else {
        filteredStudents = students.filter(
          (s: { classId: number }) => s.classId === classId
        );
      }

      console.log("filteredStudents", filteredStudents);

      setRelatedStudents(filteredStudents);
    }
    setValue("date", data?.startTime || existingLesson?.startTime);
    setAttendanceDate(data?.startTime || existingLesson?.startTime);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create"
          ? "Create a new attendance"
          : "Update the attendance"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Attendance id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <InputField
          label="Lesson start time"
          type="datetime-local"
          register={register}
          name="date"
          hidden={true}
        />
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            {...register("lessonId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.lessonId}
            onChange={handleLessonChange}
          >
            {lessons.map(
              (l: {
                id: string;
                name: string;
                subject: { name: string };
                class: { name: string };
              }) => (
                <option
                  value={l.id}
                  key={l.id}
                >{`${l.name}; Subject: ${l.subject.name}; Class: ${l.class.name}`}</option>
              )
            )}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Student</label>
          <select
            {...register("studentId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.studentId}
          >
            {relatedStudents.map(
              (s: { id: string; name: string; surname: string }) => (
                <option
                  value={s.id}
                  key={s.id}
                >{`${s.name} ${s.surname}`}</option>
              )
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">present/absent</label>
          <select
            {...register("present")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={
              type === "update"
                ? data?.present
                  ? "present"
                  : "absent"
                : "present"
            }
          >
            <option value="present">present</option>
            <option value="absent">absent</option>
          </select>
          {errors.present?.message && (
            <p className="text-xs text-red-400">
              {errors.present.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:max-w-max">
          <label className="text-xs text-gray-500">Lesson start time</label>
          <input
            type="datetime-local"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            disabled={true}
            value={attendanceDate && toLocalDatetimeInputValue(attendanceDate)}
          />
        </div>
      </div>

      {state.error && (
        <span className="text-red-500 text-base">Something went wrong!</span>
      )}

      <button className="bg-blue-400 text-white rounded-md p-2" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}

export default AttendanceForm;
