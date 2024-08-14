"use client";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postSignIn } from "../../../utils/userAction";
import { getSession, useSession } from "next-auth/react";

const signInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();

  // console.log(form)

  const submitHandler = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await postSignIn(data);
      console.log(`result inside signInPage`, result);
      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast({
            title: "Login Failed",
            description: "Incorrect username or password",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        }
      }
      const session = await getSession();
      // console.log(session);
      if (result) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(`Error while handling submit`, error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to Anonymous
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-6"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Not a member yet?
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default signInForm;
