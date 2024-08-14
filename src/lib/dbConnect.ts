import mongoose, { connections } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URI || "");

    // console.log(connection)
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected Successfully");
  } catch (error) {
    console.log("Database connection failed Error:", error);
    process.exit(1);
  }
}

export default dbConnect;
