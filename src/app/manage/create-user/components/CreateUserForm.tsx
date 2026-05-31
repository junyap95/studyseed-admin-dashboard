"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { CircleX } from "lucide-react";

import { userSchema, ZodUserSchema } from "@/lib/adminSchema";
import { generateRandomLetters, initializeProgress } from "@/lib/helperFunctions";
import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Course } from "@/enums/courses.enum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Topic } from "@/enums/topics.enum";

export default function CreateUserForm() {
  const router = useRouter();
  const {
    reset,
    resetField,
    setFocus,
    setError,
    handleSubmit,
    getValues,
    setValue,
    control,
    trigger,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<ZodUserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      enrolled_courses: [],
      userid: "",
      courses: [], // This is the topics field
    },
    mode: "onChange",
  });

  // Topic checkbox logic
  const topicValues = Object.values(Topic);

  // Define which courses only allow which topics
  const coursesWithOnlyLiteracy = [Course.MACKLE];
  const coursesWithOnlyNumeracy: Course[] = []; // Add if needed in future

  // Get selected/enrolled courses
  const enrolledCourses =
    (getValues("enrolled_courses") as { course: Course }[])?.map((c) => c.course) || [];

  // Determine if a topic should be disabled
  const isTopicDisabled = (topic: Topic): boolean => {
    // If any enrolled course only allows LITERACY, disable NUMERACY
    if (
      topic === Topic.NUMERACY &&
      enrolledCourses.every((c) => coursesWithOnlyLiteracy.includes(c))
    ) {
      return true;
    }
    // If any enrolled course only allows NUMERACY, disable LITERACY
    if (
      topic === Topic.LITERACY &&
      enrolledCourses.every((c) => coursesWithOnlyNumeracy.includes(c))
    ) {
      return true;
    }
    return false;
  };

  const handleTopicCheckBoxChange = (topic: Topic, checked: boolean) => {
    const currentTopics = getValues("courses") as Topic[];
    if (checked) {
      if (!currentTopics.includes(topic)) {
        setValue("courses", [...currentTopics, topic], { shouldDirty: true, shouldValidate: true });
      }
    } else {
      setValue(
        "courses",
        currentTopics.filter((t) => t !== topic),
        { shouldDirty: true, shouldValidate: true },
      );
    }
  };

  const { remove, fields, append } = useFieldArray({ control, name: "enrolled_courses" });

  const [, setUserArr] = useLocalStorage<ZodUserSchema[]>("new-users", []);

  const handleCheckBoxChange = (course: Course, checked: boolean) => {
    if (checked) {
      append({ course });
    } else {
      const index = fields.findIndex((f) => f.course === course);
      if (index !== -1) {
        remove(index);
      }
    }
  };

  const onSubmit = async () => {
    try {
      const formData = getValues();

      const reqBody = {
        ...formData,
        progress: initializeProgress(
          formData.enrolled_courses.map((courseObj) => courseObj.course) as Course[],
        ),
      };

      await createUserMutation.mutateAsync(reqBody);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const queryClient = useQueryClient();

  type CreateUserResponse = { savedResult?: ZodUserSchema; message?: string };
  type CreateUserBody = ZodUserSchema & { progress: Record<string, unknown> };

  const createUserFn = async (body: CreateUserBody) => {
    const res = await fetch(DashboardAPIPath.CREATE_NEW_USER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data?.message || "Error creating user") as Error & { status?: number };
      err.status = res.status;
      throw err;
    }
    return data;
  };

  const createUserMutation = useMutation<
    CreateUserResponse,
    Error & { status?: number },
    CreateUserBody
  >({
    mutationFn: createUserFn,
    onSuccess: (data: CreateUserResponse) => {
      if (data && data.savedResult) {
        setUserArr((prev) => [...(prev ?? []), data.savedResult as ZodUserSchema]);
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      toast(`User ${data.savedResult?.userid} successfully created.`);
    },
    onError: (error: Error & { status?: number }) => {
      const status = error?.status;
      setError("root", { type: "manual", message: error?.message || "Unexpected error" });
      if (status === 401) {
        setTimeout(() => router.push("/"), 3000);
      }
      if (status === 409) {
        resetField("userid");
        setFocus("userid");
      }
    },
  });

  const handleAutoGenerate = async () => {
    const isValid = await trigger(["first_name", "last_name"]);

    if (!isValid) {
      // Optional: custom messages if you want full control
      if (!getValues("first_name")) {
        setError("first_name", {
          type: "manual",
          message: "First name is required to generate a user ID",
        });
      }

      if (!getValues("last_name")) {
        setError("last_name", {
          type: "manual",
          message: "Last name is required to generate a user ID",
        });
      }

      return;
    }

    const { first_name, last_name } = getValues();

    const generatedUserId =
      `${first_name[0].toUpperCase()}` +
      `${last_name[0].toUpperCase()}01` +
      generateRandomLetters(2);

    setValue("userid", generatedUserId, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-2 p-3 border-solid border-1 rounded-2xl"
    >
      <h2 className="mb-3">Create User</h2>

      <FieldGroup>
        <Controller
          name="first_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input {...field} placeholder="e.g. Jane" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="last_name"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input {...field} placeholder="e.g. Doe" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="userid"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>User ID</FieldLabel>
              <div className="flex items-center gap-3">
                <Input className="flex-1" {...field} placeholder="e.g. JD01AA" />

                <Button
                  className="flex-1"
                  type="button"
                  variant="secondary"
                  aria-disabled={!isDirty}
                  onClick={handleAutoGenerate}
                >
                  Auto-generate User ID
                </Button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <hr />

        <div className="flex flex-col gap-2">
          <Dialog>
            <DialogTitle className="sr-only">Select At Least 1 Course</DialogTitle>

            <FieldLabel className="flex items-center justify-between w-full">
              Enrolled Courses
              <DialogTrigger asChild>
                <Button variant="outline">Add course</Button>
              </DialogTrigger>
            </FieldLabel>
            <DialogContent>
              <Field>
                <FieldLabel>
                  <h2>Available Courses</h2>
                </FieldLabel>

                {Object.values(Course).map((course) => {
                  const isChecked = fields.some((f) => f.course === course);

                  return (
                    <div key={course} className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckBoxChange(course, checked as boolean)
                        }
                      />
                      <span className="text-sm">{course}</span>
                    </div>
                  );
                })}
              </Field>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">Done</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>

            <div className="flex gap-2">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">No courses selected</p>
              )}
              {fields.map((field) => (
                <Button
                  key={field.course}
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const index = fields.findIndex((f) => f.course === field.course);
                    toast.success(`Removed ${fields[index].course}`);
                    remove(index);
                  }}
                >
                  <span>{field.course}</span>
                  <CircleX strokeWidth={1} />
                </Button>
              ))}
            </div>
          </Dialog>
        </div>
       
        <hr />
         {/* Topic Checkbox Section */}
         <Controller
          name="courses"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Topics</FieldLabel>
              <div className="flex flex-col gap-2">
                {topicValues.map((topic) => {
                  const disabled = isTopicDisabled(topic);
                  return (
                    <div key={topic} className="flex items-center gap-2">
                      <Checkbox
                        {...field}
                        defaultChecked= {false}
                        disabled={disabled}
                        onCheckedChange={(checked) =>
                          !disabled && handleTopicCheckBoxChange(topic, checked as boolean)
                        }
                      />
                      <span className={`text-sm${disabled ? " text-gray-400" : ""}`}>{topic}</span>
                    </div>
                  );
                })}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
   
        <hr className="m-3" />
        <Button aria-disabled={!isValid} type="submit" className="bg-studyseed-blue">
          {isSubmitting ? <Spinner /> : "Create New User"}
        </Button>
        {errors.root && <div>{errors.root.message}</div>}
      </FieldGroup>
    </form>
  );
}
