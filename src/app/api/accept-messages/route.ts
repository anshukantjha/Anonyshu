import { auth } from "@/auth";
import { findUserById, updateUserById } from "@/lib/mongoFunction";
import response from "@/utils/response";
import { User } from "next-auth";

// changes in db status of accepting message
export async function POST(request: Request) {
  // Connect to the database

  const session = await auth();
  const user: User = session?.user;
  if (!session || !session.user) {
    return response("User not Authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await updateUserById(userId!, {
      $set: { isAcceptingMessages: acceptMessages },
    });

    if (!updatedUser!) {
      // User not found
      return response(
        "Unable to find user to update message acceptance status",
        404
      );
    }
    console.log(updatedUser)

    // Successfully updated message acceptance status
    return response(
      "Message acceptance status updated successfully",
      201,
      updatedUser
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return response("Error updating message acceptance status", 500);
  }
}

// gives the status whether user is accepting message or not via get method
export async function GET(request: Request) {
  // Connect to the database

  // Get the user session
  const session = await auth();
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return response("Not Authenticated", 401);
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await findUserById(user._id);
    // console.log(`foundUser in get request`,foundUser)
    if (!foundUser) {
      // User not found
      return response("User not found", 404);
    }

    // Return the user's message acceptance status
    return response("Ok", 200, foundUser.isAcceptingMessages);
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return response("Error retrieving message acceptance status", 500);
  }
}
