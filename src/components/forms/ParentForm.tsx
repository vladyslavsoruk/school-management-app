"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createParent, updateParent } from "@/lib/actions";
import { useFormState } from "react-dom";

function ParentForm({
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
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const parentAction = type === "create" ? createParent : updateParent;

  const [state, formAction] = useFormState(parentAction, {
    success: false,
    error: false,
  });
  const onSubmit = handleSubmit((d) => {
    console.log("HELLO from react-hook-form!!!");
    console.log(d);
    formAction({ ...d });
  });

  const router = useRouter();

  useEffect(() => {
    state.success && toast(`Teacher was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new parent" : "Update the parent"}
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
      </div>
      <div className="flex justify-center">
        <InputField
          label="Address"
          type="text"
          register={register}
          name="address"
          defaultValue={data?.address}
          error={errors.address}
        />
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

export default ParentForm;
