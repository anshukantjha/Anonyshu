// this GET route will get all the messages of a user to display
import { auth } from "@/auth";
import { aggregateUserMessages, Message } from "@/lib/mongoFunction";
import response from "@/utils/response";
import { User } from "next-auth";

export async function GET(request: Request) {
  const session = await auth();
  const user: User = session?.user;
  if (!session || !user) {
    return response("User not Authenticated", 401);
  }

  // for number createFromTime
  try {
    const res= await aggregateUserMessages({ userId: user._id! });

    // console.log(user)

    if (!user) {
      return response("User not found", 404);
    }
    return response("Ok", 201, res);
  } catch (error) {
    console.log("Error getting messages", error);
    return response("Error getting message", 500);
  }
}
