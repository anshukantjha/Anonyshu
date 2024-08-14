"use server";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "@/auth";

export async function postSignIn(
  data: z.infer<typeof signInSchema>
): Promise<any> {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    return result;
  } catch (error) {
    console.log(`Error while posting signIn method`, error);
    return null;
  }
}
