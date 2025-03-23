"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

function FormModal({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
}) {
  const [open, setOpen] = useState(false);

  const Form = () => {
    return type === "delete" && id ? (
      <form className="flex flex-col gap-4 p-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center"
          onClick={handleDeleteEntityClick}
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not found!"
    );
  };

  function handleDeleteEntityClick(e) {
    e.preventDefault();
    setOpen(false);
  }

  function handleClick(e) {
    console.log("Btn CLicked!!!");
    setOpen(true);
  }

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const imageSize = type === "create" ? "14" : "16";
  const bgColor =
    type === "create"
      ? "bg-customYellow"
      : type === "update"
      ? "bg-customSky"
      : "bg-customPurple";
  return (
    <div>
      <button
        className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
        onClick={handleClick}
      >
        <Image
          src={`/${type}.png`}
          alt=""
          width={`${imageSize}`}
          height={`${imageSize}`}
        />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-[999] flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <div className="absolute top-4 right-4 cursor-pointer">
              <Image
                src={"/close.png"}
                alt=""
                width={14}
                height={14}
                onClick={() => setOpen(false)}
              />
            </div>
            <Form />
          </div>
        </div>
      )}
    </div>
  );
}

export default FormModal;
