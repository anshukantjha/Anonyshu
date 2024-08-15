import response from "@/utils/response";
import { auth } from "@/auth";
import { updateUserById } from "@/lib/mongoFunction";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request) {
  // console.log(`url of request`,request.url)
  const messageId = request.url.split("/")[5];
  const session = await auth();
  const _user = session?.user;
  //   console.log(_user)
  if (!session || !_user) {
    return response("User not authenticated", 403);
  }
  // console.log(messageId);

  try {
    // const updateResult = await UserModel.updateOne(
    //   { _id: _user._id },
    //   { $pull: { messages: { _id: messageId } } }
    // );
    // console.log(updateResult);

    const updateResult = await updateUserById(_user._id, {
      $pull: { messages: { _id:new ObjectId(messageId)  } }, // Pulling message by its ObjectId
    });

    if (updateResult.modifiedCount === 0) {
      return response("Message not found or already deleted", 404);
    }
    return response("Message deleted", 200);
  } catch (error) {
    console.log(`Error while deleting message`);
    return response("Error deleting message", 500);
  }
}
