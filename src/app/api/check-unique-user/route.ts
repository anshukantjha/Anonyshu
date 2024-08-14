import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";
import response from "@/utils/response";

const UsernameQuerySchema = z.object({
  username:usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  //   console.log(request);
  try {
    const { searchParams } = new URL(request.url);
    const usernameQuery = { username: searchParams.get("username") };

    // console.log(usernameQuery);

    const result = UsernameQuerySchema.safeParse(usernameQuery);
    console.log(result);

    if (result.success) {
      const existingVerifiedUser = await UserModel.findOne({
        username: usernameQuery.username,
        isVerified: true,
      });

      if (existingVerifiedUser) {
        return response("Username already Taken", 401);
      }
      return response("username Exists", 201);
    }

    // const paramsError = result.error;
    // console.log(1,paramsError)

    const paramsError = result.error.format().username?._errors;
    return response(`username is not in Format :${paramsError}`, 400);
  } catch (error) {
    console.log("Error checking username :", error);
    return response("Error Checking username", 500);
  }
}
