"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { toLocalDatetimeInputValue } from "@/lib/utils";

let role: string | null = null;

function LessonForm({
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const { teachers, subjects, classes } = relatedData;
  const [relatedTeachers, setRelatedTeachers] = useState(teachers);

  const lessonAction = type === "create" ? createLesson : updateLesson;

  const [state, formAction] = useFormState(lessonAction, {
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit((d) => {
    console.log("HELLO from react-hook-form!!!");
    console.log(d);
    formAction(d);
  });

  const router = useRouter();

  useEffect(() => {
    state.success && toast(`Lesson was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  // Teachers that can be assigned to the lesson on particular subject
  useEffect(() => {
    if (role === "teacher") {
      return;
    }
    // If type is update, set the default value to the subjectId from data
    // If type is create, set the default value to 1
    const subjectId = parseInt(data?.subjectId) || subjects[0]?.id;
    console.log("Teachers:", teachers);
    console.log("subjectId:", subjectId);

    if (teachers && subjectId) {
      // Filter teachers based on the subject they teach
      const filteredTeachers = teachers.filter(
        (teacher: { subjects: { id: number }[] }) =>
          teacher.subjects.some(
            (subject: { id: number }) => subject.id === subjectId
          )
      );
      setRelatedTeachers(filteredTeachers);
    }
  }, [teachers]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value);

    if (teachers) {
      const filteredTeachers = teachers.filter(
        (teacher: { subjects: { id: number }[] }) =>
          teacher.subjects.some(
            (subject: { id: number }) => subject.id === subjectId
          )
      );
      setRelatedTeachers(filteredTeachers);
    }
  };
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new lesson" : "Update the lesson"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Lesson id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            {...register("subjectId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            // If type is update, set the default value to the subjectId from data
            // If type is create, set the default value to 1
            defaultValue={data?.subjectId || 1}
            onChange={handleSubjectChange}
          >
            {subjects.map((s: { id: string; name: string }) => (
              <option value={s.id} key={s.id}>{`${s.name}`}</option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Lesson name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors?.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.classId}
          >
            {classes.map((c: { id: string; name: string }) => (
              <option value={c.id} key={c.id}>{`${c.name}`}</option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Start time"
          type="datetime-local"
          register={register}
          name="startTime"
          defaultValue={
            data?.startTime && toLocalDatetimeInputValue(data?.startTime)
          }
          error={errors?.startTime}
        />
        <InputField
          label="End time"
          type="datetime-local"
          register={register}
          name="endTime"
          defaultValue={
            data?.endTime && toLocalDatetimeInputValue(data?.endTime)
          }
          error={errors?.endTime}
        />
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            {...register("teacherId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.teacherId}
          >
            {relatedTeachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                >{`${teacher.name} ${teacher.surname}`}</option>
              )
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white rounded-md p-2" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
}

export default LessonForm;
