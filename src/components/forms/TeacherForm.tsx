"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood type is required!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  //   img: z.any().refine((files) => files?.[0], { message: "Image is required!" }),
  img: z.instanceof(File, { message: "Image is required!" }),
});

type Inputs = z.infer<typeof schema>;

function TeacherForm({
  data,
  type,
}: {
  data?: any;
  type: "create" | "update";
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((d) => {
    console.log("HELLO from react-hook-form!!!");
    console.log(d);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new teacher" : "Update the teacher"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
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
          name="firstName"
          defaultValue={data?.firstName}
          error={errors.firstName}
        />
        <InputField
          label="Last name"
          type="text"
          register={register}
          name="lastName"
          defaultValue={data?.lastName}
          error={errors.lastName}
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
          // defaultValue={data?.birthday}
          error={errors.birthday}
          inputProps={{ value: data?.birthday }}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            {...register("sex")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && (
            <p className="text-xs text-red-400">{errors?.sex.toString()}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4 self-end">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input id="img" type="file" {...register("img")} className="hidden" />

          {errors.img && (
            <p className="text-xs text-red-400">{errors?.img.toString()}</p>
          )}
        </div>
      </div>
      {/* <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <label>Enter your username:</label>
      <input
        type="text"
        {...register("username")}
        // className="border border-gray-800"
      />
      {errors.username?.message && <p>{errors.username?.message}</p>}
      <label>Load your image!</label>
      <input type="file" {...register("img")} />
      {errors.img?.message && <p>{errors.img?.message}</p>} */}

      <button className="bg-blue-400 text-white rounded-md p-2" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
      {/* <input type="submit" /> */}
    </form>
  );
}

export default TeacherForm;
