import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import response from "@/utils/response";


// sending message to user 
export async function POST(request: Request) {
  await dbConnect();
  // const {content,identifierHint} =
  const { content, username } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    console.log( `user inside sendmessage route`,user)
    if (!user) {
      return response("User not found", 404);
    }

    // now acceptance status is checked
    if (!user.isAcceptingMessages) {
      return response("User not accepting message", 403);
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return response(`Message sent Successfully to ${username}`, 201);
  } catch (error) {
    console.log("Error adding message", error);
    return response("Error adding message", 500);
  }
}
