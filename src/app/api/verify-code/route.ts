import { findOne, updateUserById } from "@/lib/mongoFunction";
import response from "@/utils/response";

export async function POST(request: Request) {
  try {
    const { username, verifyCode } = await request.json();
    console.log(username)
    // console.log(username,verifyCode)
    const user = await findOne({
      filter: {
        username,
      },
    });

    if (!user) {
      return response("User not found", 404);
    }
    // console.log(user)
    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === verifyCode;
    // console.log(isCodeValid)
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    // console.log(isCodeNotExpired)
    if (isCodeValid && isCodeNotExpired) {
      // Update the user's verification status

      await updateUserById(user._id, { $set: { isVerified: true } });

      return response("Account Verified Successfully", 201);
    } else if (!isCodeNotExpired) {
      // Code has expired
      return response(
        "Verification code has expired. Please sign up again to get a new code.",
        400
      );
    } else {
      // Code is incorrect
      return response("Incorrect Verification Code", 401, false);
    }
  } catch (error) {
    console.log("Error Verifying Code");
    return response("Error while Verifying", 500);
  }
}
