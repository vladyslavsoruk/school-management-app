"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createStudent, updateStudent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { CldUploadWidget } from "next-cloudinary";

function StudentForm({
  setOpen,
  data,
  type,
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const studentAction = type === "create" ? createStudent : updateStudent;

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(studentAction, {
    success: false,
    error: false,
  });
  const onSubmit = handleSubmit((d) => {
    console.log("HELLO from react-hook-form!!!");
    console.log(d);
    formAction({ ...d, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    state.success && toast(`Student was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  const { grades, classes } = relatedData;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <InputField
          label="Username"
          type="text"
          register={register}
          name="username"
          defaultValue={data?.username}
          error={errors.username}
        />
        <InputField
          label="Email"
          type="email"
          register={register}
          name="email"
          defaultValue={data?.email}
          error={errors.email}
        />
        <InputField
          label="Password"
          type="password"
          register={register}
          name="password"
          defaultValue={data?.password}
          error={errors.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First name"
          type="text"
          register={register}
          name="name"
          defaultValue={data?.name}
          error={errors.name}
        />
        <InputField
          label="Last name"
          type="text"
          register={register}
          name="surname"
          defaultValue={data?.surname}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          type="text"
          register={register}
          name="phone"
          defaultValue={data?.phone}
          error={errors.phone}
        />
        <InputField
          label="Address"
          type="text"
          register={register}
          name="address"
          defaultValue={data?.address}
          error={errors.address}
        />
        <InputField
          label="Blood type"
          type="text"
          register={register}
          name="bloodType"
          defaultValue={data?.bloodType}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          type="date"
          register={register}
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          error={errors.birthday}
        />
        <InputField
          label="Parent Id"
          type="text"
          register={register}
          name="parentId"
          defaultValue={data?.parentId}
          error={errors.parentId}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            {...register("sex")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.sex}
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          {errors.sex && (
            <p className="text-xs text-red-400">{errors?.sex.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            {...register("gradeId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: string }) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message?.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.classId}
          >
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                capacity: number;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name} {"\u2014"} Capacity:{" "}
                  {classItem._count.students + "/" + classItem.capacity}
                </option>
              )
            )}
          </select>
          {errors.classId && (
            <p className="text-xs text-red-400">
              {errors.classId.message?.toString()}
            </p>
          )}
        </div>
        <div className="w-full md:w-1/4 self-center">
          <CldUploadWidget
            uploadPreset="school-dashboard-ui"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                  onClick={() => open()}
                >
                  <Image src="/upload.png" alt="" width={28} height={28} />
                  <span>Upload a photo</span>
                </div>
              );
            }}
          </CldUploadWidget>
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

export default StudentForm;
