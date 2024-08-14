import dbConnect from "@/lib/dbConnect";
import sendVerificationEmail from "@/lib/sendVerificationEmail";
import UserModel from "@/model/User";
import { hashPassword } from "@/utils/password";

export async function POST(request: Request) {
  await dbConnect();
  // console.log(request);
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedByUsername) {
      return {
        success: false,
        message: "username already exists",
      };
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // user is verified so just return
        // being a return statement below so email will not be sent in this case

        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // user is not verified so need to update password
        const hashedPassword = await hashPassword(password);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // user doesn't exist with that email so create a new one
      const hashedPassword = await hashPassword(password);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email for both
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode,
    );

    console.log(emailResponse);

    // if (!emailResponse.success) {
    if (!true) {
      return Response.json(
        {
          success: false,
          // message: emailResponse.message,
          message: "emailResponse.message",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "User registered Successfully Follow mail to Verify",
    });
  } catch (error) {
    console.error("Error registering User", error);
    return Response.json({
      success: false,
      message: "Error registering user",
    });
  }
}
