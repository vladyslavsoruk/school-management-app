"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import {
  assignmentSchema,
  AssignmentSchema,
} from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { toLocalDatetimeInputValue } from "@/lib/utils";

function AssignmentForm({
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
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  const assignmentAction =
    type === "create" ? createAssignment : updateAssignment;

  const [state, formAction] = useFormState(assignmentAction, {
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
    state.success && toast(`Assignment was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  const { lessons } = relatedData;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create"
          ? "Create a new assignment"
          : "Update the assignment"}
      </h1>
      <div className="flex justify-between flex-wrap">
        {data && (
          <InputField
            label="Assignment id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <InputField
          label="Assignment title"
          type="text"
          register={register}
          name="title"
          defaultValue={data?.title}
          error={errors?.title}
        />
        <InputField
          label="Start date"
          type="datetime-local"
          register={register}
          name="startDate"
          defaultValue={
            data?.startDate && toLocalDatetimeInputValue(data?.startDate)
          }
          error={errors?.startDate}
        />
        <InputField
          label="Due date"
          type="datetime-local"
          register={register}
          name="dueDate"
          defaultValue={
            data?.dueDate && toLocalDatetimeInputValue(data?.dueDate)
          }
          error={errors?.dueDate}
        />
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            {...register("lessonId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.lessonId}
          >
            {lessons.map(
              (lesson: {
                id: string;
                name: string;
                class: any;
                subject: any;
              }) => (
                <option value={lesson.id} key={lesson.id}>
                  {lesson.name} ({lesson.subject.name}; Class{" "}
                  {lesson.class.name})
                </option>
              )
            )}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
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

export default AssignmentForm;
