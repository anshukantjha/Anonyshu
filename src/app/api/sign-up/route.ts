import { createUser, findOne, findUserByEmail, updateUserById } from "@/lib/mongoFunction";
import sendVerificationEmail from "@/lib/sendVerificationEmail";
import { hashPassword } from "@/utils/password";
import response from "@/utils/response";

export async function POST(request: Request) {
  // console.log(request);
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedByUsername = await findOne({
      filter: {
        username,
        isVerified: true,
      },
    });

    if (existingVerifiedByUsername) {
      return response('username already exists',403)
    }

    const existingUserByEmail = await findUserByEmail(email);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // user is verified so just return
        // being a return statement below so email will not be sent in this case

        return response('User already exists with this email',400)
      } else {
        // user is not verified so need to update password
        const hashedPassword = await hashPassword(password);
        existingUserByEmail.password = hashedPassword;
        const verifyCodeExpiry = new Date(Date.now() + 3600000);
        const userId = existingUserByEmail._id;
        await updateUserById(userId!, {
          $set: { password: hashPassword, verifyCode, verifyCodeExpiry },
        });
      }
    } else {
      // user doesn't exist with that email so create a new one
      const hashedPassword = await hashPassword(password);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = {
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
        isVerified:false,
        isAcceptingMessages:true,
      };

      await createUser(newUser)
    }

    // send verification email for both
    const emailResponse = await sendVerificationEmail(
      username,
      email,
      verifyCode
    );

    console.log(emailResponse);

    // if (!emailResponse.success) {
    if (!true) {
      return response('emailResponse not here',405,emailResponse)
    }

    return response('User registered Successfully Follow mail to Verify',201)
  } catch (error) {
    console.error("Error registering User", error);
    return response("Error registering user",500)
  }
}
