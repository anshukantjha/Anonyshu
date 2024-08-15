import { findOne, Message, updateUserById } from "@/lib/mongoFunction";
import response from "@/utils/response";
import { ObjectId } from "mongodb";

// sending message to user
export async function POST(request: Request) {
  // const {content,identifierHint} =
  const { content, username } = await request.json();
  try {
    const user = await findOne({
      filter: {
        username: username,
      },
    });
    console.log(`user inside sendmessage route`, user);
    if (!user) {
      return response("User not found", 404);
    }

    // now acceptance status is checked
    if (!user.isAcceptingMessages) {
      return response("User not accepting message", 403);
    }
    const newMessage = { _id: new ObjectId(), content, createdAt: new Date() };
    await updateUserById(user._id, { $push: { messages: newMessage } });

    return response(`Message sent Successfully to ${username}`, 201);
  } catch (error) {
    console.log("Error adding message", error);
    return response("Error adding message", 500);
  }
}
