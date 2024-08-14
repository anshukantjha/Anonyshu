import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import UserModel from "./model/User";
import dbConnect from "./lib/dbConnect";
import { comparePassword } from "@/utils/password";
import { toast } from "./components/ui/use-toast";
import response from "./utils/response";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials: any): Promise<any> => {
        console.log("Received credentials:", credentials);
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials.email,
          });
          if (!user) {
            response("No user found with this email", 404);
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            response("Please verify your account before logging in", 403);
            throw new Error("Please verify your account before logging in");
          }
          const isPasswordCorrect = await comparePassword(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            // console.log("User authenticated:", user);
            // response("ok", 201, user);
            return user;
          } else {
            throw new Error("Invalid user Credentials");
          }
        } catch (err: any) {
          console.error("Error during authorization:", err);
          throw new Error("Authorization failed: " + err.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      // console.log(`jwt Token`, token);
      // console.log(`jwt user`, user);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      // console.log(`session session`, session);
      // console.log(`session token`, token);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/sign-in" },
  // debug: true,
});
