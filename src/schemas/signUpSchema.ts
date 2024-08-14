import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username should be atleast 2 char")
  .max(20, "username should be atmost 20 char")
  .regex(/^[a-zA-Z0-9_]+$/, "username should not contain special char");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, "Password should be minimum 6 characters"),
});
