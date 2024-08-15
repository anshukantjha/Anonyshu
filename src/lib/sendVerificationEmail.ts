import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import VerificationEmail from "@/components/emailTemplate";

async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    // host:process.env.SMTP_HOST,
    // port:process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      // simple mail transfer protocol
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: "Verification for Anonymous message",
    html: emailHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.log("Error in sending email: " + error);
    return false;
  }
}

export default sendVerificationEmail;
