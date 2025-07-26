"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { eventSchema, EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { toLocalDatetimeInputValue } from "@/lib/utils";

function EventForm({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  const eventAction = type === "create" ? createEvent : updateEvent;

  const [state, formAction] = useFormState(eventAction, {
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
    state.success && toast(`Event was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  const { classes } = relatedData;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new event" : "Update the event"}
      </h1>
      <div className="flex flex-col gap-4">
        {data && (
          <InputField
            label="Event id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <InputField
            label="Event title"
            type="text"
            register={register}
            name="title"
            defaultValue={data?.title}
            error={errors?.title}
          />
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs text-gray-500">Class</label>
            <select
              {...register("classId")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
              defaultValue={data?.classId}
            >
              <option value={0}>All classes</option>
              {classes.map((cls: { id: string; name: string }) => (
                <option value={cls.id} key={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors.classId?.message && (
              <p className="text-xs text-red-400">
                {errors.classId.message.toString()}
              </p>
            )}
          </div>
          <InputField
            label="Event description"
            type="text"
            register={register}
            name="description"
            defaultValue={data?.description}
            error={errors?.description}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
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
              data?.startTime && toLocalDatetimeInputValue(data?.endTime)
            }
            error={errors?.endTime}
          />
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

export default EventForm;
