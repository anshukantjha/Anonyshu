import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import response from "@/utils/response";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function DELETE(request: Request) {
  const messageId = request.url.split("/")[5];
  await dbConnect();
  const session = await auth();
  const _user = session?.user;
  //   console.log(_user)
  if (!session || !_user) {
    return response("User not authenticated", 403);
  }
  // console.log(messageId);

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    // console.log(updateResult);

    if (updateResult.modifiedCount === 0) {
      return response("Message not found or already deleted", 404);
    }
    return response("Message deleted", 200);
  } catch (error) {
    console.log(`Error while deleting message`);
    return response("Error deleting message", 500);
  }
}
