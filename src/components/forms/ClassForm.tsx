"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { ClassSchema, classSchema } from "@/lib/formValidationSchemas";
import { createClass, updateClass } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function ClassForm({
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
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  const classAction = type === "create" ? createClass : updateClass;

  const [state, formAction] = useFormState(classAction, {
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
    state.success && toast(`Class was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  const { grades, teachers } = relatedData;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new class" : "Update the class"}
      </h1>
      <div className="flex justify-between flex-wrap">
        {data && (
          <InputField
            label="Class id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <InputField
          label="Class name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors?.name}
        />
        <InputField
          label="Class capacity"
          type="text"
          register={register}
          name="capacity"
          defaultValue={data?.capacity}
          error={errors?.capacity}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            {...register("gradeId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: string; level: string }) => (
              <option
                value={grade.id}
                key={grade.id}
                selected={data && grade.id === data.gradeId}
              >
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            {...register("supervisorId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.supervisorId}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                  selected={data && teacher.id === data.supervisorId}
                >
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
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

export default ClassForm;
