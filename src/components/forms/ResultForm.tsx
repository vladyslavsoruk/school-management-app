"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function ResultForm({
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
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      resultType: data?.isExam ? "exam" : "assignment",
      studentId: data?.studentId,
      assignmentId:
        data?.assignmentId ?? relatedData.assignments?.[0]?.id ?? "",
      examId: data?.examId ?? relatedData.exams?.[0]?.id ?? "",
    },
  });
  const [resultOfExam, setResultOfExam] = useState(false);

  // Subscribe to assignmentId and examId changes
  const watchedAssignmentId = watch("assignmentId");
  const watchedExamId = watch("examId");

  useEffect(() => {
    if (!resultOfExam) {
      console.log("Выбрана AssignmentId:", watchedAssignmentId);
      let aId = watchedAssignmentId;
      if (!aId) {
        aId = relatedData?.assignments?.[0]?.id || "";
      }
      handleAssignmentChangeById(Number(aId));
    } else {
      console.log("Выбрана ExamId:", watchedExamId);
      let eId = watchedExamId;
      if (!eId) {
        eId = relatedData?.exams?.[0]?.id || "";
      }
      handleExamChangeById(Number(eId));
    }
  }, [watchedAssignmentId, watchedExamId, resultOfExam]);

  const { exams, assignments, students } = relatedData;
  const [relatedStudents, setRelatedStudents] = useState(students);

  const resultAction = type === "create" ? createResult : updateResult;

  const [state, formAction] = useFormState(resultAction, {
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
    state.success && toast(`Result was successfully ${type}d!`);
    state.success && setOpen(false);
    state.success && router.refresh();
  }, [state]);

  useEffect(() => {
    console.log("data: ", data);

    // If type is update, setResultOfExam to true if it is an exam
    if (type === "update" && data?.isExam) {
      setResultOfExam(true);
      handleExamChangeById(Number(data.examId));
    }

    if (type === "update" && !data?.isExam) {
      setResultOfExam(false);
      handleAssignmentChangeById(Number(data.assignmentId));
    }

    // If type is create resultOfExam will be false by default,
    // so it will be an assignment result and we need to set the
    // related students
    if (type === "create") {
      console.log(
        "Creating or updating assignment result",
        watchedAssignmentId
      );

      handleAssignmentChangeById(Number(watchedAssignmentId));
    }
  }, [type, data]);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const examId = parseInt(e.target.value);
    handleExamChangeById(examId);
  };

  const handleExamChangeById = (examId: number) => {
    const existingExam = exams.find(
      (exam: { id: number }) => exam.id === examId
    );

    const classId = existingExam?.lesson.class.id;

    const resultsOfStudents = existingExam?.results.map(
      (result: { studentId: string }) => result.studentId
    );

    if (students && examId) {
      // Filter students based on the exam they are related to
      let filteredStudents = [];
      if (type === "create") {
        filteredStudents = students.filter(
          (student: { id: string; classId: number }) =>
            student.classId === classId &&
            !resultsOfStudents?.includes(student.id)
        );
      } else {
        filteredStudents = students.filter(
          (student: { id: string; classId: number }) =>
            student.classId === classId
        );
      }

      console.log("filteredStudents in handleExamChangeById", filteredStudents);

      if (filteredStudents.length > 0) {
        const defaultStudentIdFits = filteredStudents
          .map((s: { id: any }) => s.id)
          .includes(data?.studentId);

        if (!defaultStudentIdFits) {
          setValue("studentId", filteredStudents[0].id);
        }
      }

      setRelatedStudents(filteredStudents);
    }
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assignmentId = parseInt(e.target.value);
    handleAssignmentChangeById(assignmentId);
  };

  const handleAssignmentChangeById = (assignmentId: number) => {
    const existingAssignment = assignments.find(
      (a: { id: number }) => a.id === assignmentId
    );

    const classId = existingAssignment?.lesson.class.id;

    const resultsOfStudents = existingAssignment?.results.map(
      (result: { studentId: string }) => result.studentId
    );

    if (students && assignmentId) {
      // Filter students based on the assignment they are related to
      let filteredStudents = [];
      if (type === "create") {
        filteredStudents = students.filter(
          (student: { id: string; classId: number }) =>
            student.classId === classId &&
            !resultsOfStudents?.includes(student.id)
        );
      } else {
        filteredStudents = students.filter(
          (student: { id: string; classId: number }) =>
            student.classId === classId
        );
      }
      console.log(
        "filteredStudents in handleAssignmentChangeById",
        filteredStudents
      );

      if (filteredStudents.length > 0) {
        console.log("Default studentId value: ", data?.studentId);
        const defaultStudentIdFits = filteredStudents
          .map((s: { id: any }) => s.id)
          .includes(data?.studentId);
        if (!defaultStudentIdFits) {
          console.log("setValue(studentId, filteredStudents[0].id)");

          setValue("studentId", filteredStudents[0].id);
        }
      }

      setRelatedStudents(filteredStudents);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="font-semibold text-xl">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>
      <div className="flex justify-between flex-wrap">
        {data && (
          <InputField
            label="Result id"
            type="number"
            register={register}
            name="id"
            defaultValue={data?.id}
            hidden={true}
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Result type</label>
          <Controller
            control={control}
            name="resultType"
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  const isExam = e.target.value === "exam";
                  field.onChange(e); // обновляем resultType
                  setResultOfExam(isExam); // локальное состояние

                  // const defaultStudents = isExam
                  //   ? relatedData.exams
                  //       .find(
                  //         (x: { id: number }) =>
                  //           x.id === Number(watch("examId"))
                  //       )
                  //       ?.results.map((r: { studentId: any }) => r.studentId)
                  //   : relatedData.assignments
                  //       .find(
                  //         (x: { id: number }) =>
                  //           x.id === Number(watch("assignmentId"))
                  //       )
                  //       .lesson.class.students.map((s: { id: any }) => s.id);
                  // const newStudentId = defaultStudents?.[0] ?? "";
                  // setValue("studentId", relatedStudents[0]?.id, {
                  //   shouldDirty: true,
                  // });

                  // console.log("watch resultType examId", watchedExamId);
                  // console.log(
                  //   "watch resultType assignmentId",
                  //   watchedAssignmentId
                  // );

                  // isExam
                  //   ? handleExamChangeById(watchedExamId!)
                  //   : handleAssignmentChangeById(watchedAssignmentId!);
                }}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              >
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
              </select>
            )}
          />
          {errors.resultType && (
            <p className="text-xs text-red-400">{errors.resultType.message}</p>
          )}
        </div>

        {resultOfExam && (
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs text-gray-500">Exam</label>
            <select
              id="examIdValue"
              {...register("examId")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
              defaultValue={data?.examId}
              onChange={handleExamChange}
            >
              {exams.map(
                (e: {
                  id: string;
                  title: string;
                  lesson: { class: { name: string } };
                }) => (
                  <option
                    value={e.id}
                    key={e.id}
                  >{`${e.title}; Class ${e.lesson.class.name}`}</option>
                )
              )}
            </select>
            {errors.examId?.message && (
              <p className="text-xs text-red-400">
                {errors.examId.message.toString()}
              </p>
            )}
          </div>
        )}
        {!resultOfExam && (
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-xs text-gray-500">Assignment</label>
            <select
              id="assignmentIdValue"
              {...register("assignmentId")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md  text-sm w-full"
              defaultValue={data?.assignmentId}
              onChange={handleAssignmentChange}
            >
              {assignments.map(
                (a: {
                  id: string;
                  title: string;
                  lesson: { class: { name: string } };
                }) => (
                  <option
                    value={a.id}
                    key={a.id}
                  >{`${a.title}; Class ${a.lesson.class.name}`}</option>
                )
              )}
            </select>
            {errors.assignmentId?.message && (
              <p className="text-xs text-red-400">
                {errors.assignmentId.message.toString()}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-500">Student</label>
          <Controller
            control={control}
            name="studentId"
            render={({ field }) => (
              <select
                {...field}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              >
                {relatedStudents.map(
                  (s: { id: string; name: string; surname: string }) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.surname}
                    </option>
                  )
                )}
              </select>
            )}
          />
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <InputField
          label="Score"
          type="number"
          register={register}
          name="score"
          defaultValue={data?.score ?? ""}
          error={errors?.score}
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

export default ResultForm;
