import { z } from "zod";

export const adminSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const userSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  userid: z
    .string()
    .min(6, { message: "Must contain at least 6 characters" })
    .max(8, { message: "Must contain no more than 8 characters" }),
  enrolled_courses: z
    .object({
      course: z.string(),
    })
    .array()
    .min(1, { message: "Must include at least one course" }),
  courses: z.string().array().default(["LITERACY", "NUMERACY"]),
});

export type ZodUserSchema = z.infer<typeof userSchema>;
