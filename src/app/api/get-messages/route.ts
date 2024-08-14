// this GET route will get all the messages of a user to display
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { auth } from "@/auth";
import response from "@/utils/response";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user;
  if (!session || !user) {
    return response("User not Authenticated", 401);
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  // for number createFromTime
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // console.log(user)

    if (!user) {
        return response("User not found",404);
    }
    return response("Ok",201,user[0].messages)

  } catch (error) {
    console.log("Error getting messages", error);
    return response("Error getting message", 500);
  }
}
