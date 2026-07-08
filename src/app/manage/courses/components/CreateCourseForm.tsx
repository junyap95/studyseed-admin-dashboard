"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createCourseSchema } from "@/lib/courseSchema";
import { KNOWN_TOPICS } from "@/lib/courseSchema";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { z } from "zod";

type CreateCourseFormValues = z.input<typeof createCourseSchema>;

export function CreateCourseForm({ onCreated }: { onCreated?: () => void }) {
  const { createCourse } = useCourseBuilder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      code: "",
      displayName: "",
      topics: [KNOWN_TOPICS[0]],
    },
    mode: "onChange",
  });

  const selectedTopics = form.watch("topics") ?? [];

  const onSubmit = async (data: CreateCourseFormValues) => {
    setIsSubmitting(true);
    try {
      await createCourse({
        code: data.code,
        displayName: data.displayName,
        topics: data.topics,
      });
      form.reset();
      onCreated?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-800">Create New Course</h3>
      <p className="text-sm text-gray-600">
        Courses are stored in the registry and get their own question collections per topic
        (e.g. <code className="text-xs">mycourse_literacy</code>).
      </p>

      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Course Code *</FieldLabel>
              <Input {...field} placeholder="e.g. GES, MYPROGRAM" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="displayName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Display Name *</FieldLabel>
              <Input {...field} placeholder="e.g. Global Education Series" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Topics * (at least one)</FieldLabel>
          <div className="flex flex-col gap-2 mt-2">
            {KNOWN_TOPICS.map((topic) => (
              <label key={topic} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={(checked) => {
                    const current = form.getValues("topics") ?? [];
                    if (checked) {
                      form.setValue("topics", [...current, topic], { shouldValidate: true });
                    } else {
                      form.setValue(
                        "topics",
                        current.filter((t) => t !== topic),
                        { shouldValidate: true },
                      );
                    }
                  }}
                />
                {topic}
              </label>
            ))}
          </div>
          {form.formState.errors.topics && (
            <FieldError errors={[form.formState.errors.topics]} />
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
        {isSubmitting ? "Creating..." : "Create Course"}
      </Button>
    </form>
  );
}
