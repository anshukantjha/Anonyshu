import axios from "axios";
// Define the Message interface
export interface Message {
  _id: string;
  content: string;
  createdAt: Date;
}

// Define the User interface
export interface User {
  _id?:string;
  username: string;
  email: string;
  password: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

interface FindOneOptions {
  collection?: string;
  database?: string;
  dataSource?: string;
  filter: Record<string, any>;
  projection?: Record<string, number>;
}

interface UpdateUserOptions {
  filter?: Record<string, any>;
  update?: Record<string, any>;
  database?: string;
  dataSource?: string;
}

interface AggregateUserMessagesOptions {
  userId: string;
  database?: string;
  dataSource?: string;
}

interface SaveUserOptions {
  user: Record<string, any>;
  database?: string;
  dataSource?: string;
}

// Base Axios config
const config = {
  baseURL:
    "https://ap-south-1.aws.data.mongodb-api.com/app/data-cszsvam/endpoint/data/v1",
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.ANON_API_KEY,
  },
};

export async function findOne({
  collection = "users",
  database = "test", // default database
  dataSource = "Initial", // default data source
  filter,
  projection = {},
}: FindOneOptions): Promise<any | null> {
  const data = JSON.stringify({
    collection,
    database,
    dataSource,
    filter,
    projection,
  });

  try {
    const response = await axios.post("/action/findOne", data, config);
    return response.data.document || null;
  } catch (error) {
    console.error("Error during findOne operation:", error);
    throw new Error("FindOne operation failed");
  }
}

// Find a user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  const data = JSON.stringify({
    collection: "users",
    database: "test",
    dataSource: "Initial",
    filter: { email },
  });

  const response = await axios.post("/action/findOne", data, config);
  return response.data.document || null; // Returns the user document if found, otherwise null
}

// Find a user by ID
export async function findUserById(id: string): Promise<User | null> {
  const data = JSON.stringify({
    collection: "users",
    database: "test",
    dataSource: "Initial",
    filter: { _id: { $oid: id } },
  });

  const response = await axios.post("/action/findOne", data, config);
  return response.data.document || null;
}

// Update a user by ID
export async function updateUserById(
  userId: string,
  update: Record<string, any>,
  options: UpdateUserOptions = {
    database: "test",
    dataSource: "Initial",
  }
): Promise<any> {
  const { database, dataSource } = options;

  const data = JSON.stringify({
    collection: "users",
    database,
    dataSource,
    filter: { _id: { $oid: userId } }, // Using MongoDB ObjectId format
    update, // Apply the update operation
  });

  try {
    const response = await axios.post("/action/updateOne", data, config);
    return response.data;
  } catch (error) {
    console.error("Error during update operation:", error);
    throw new Error("Update operation failed");
  }
}
// Create a new user
export async function createUser(userData: User): Promise<User> {
  const data = JSON.stringify({
    collection: "users",
    database: "test",
    dataSource: "Initial",
    document: userData,
  });

  const response = await axios.post("/action/insertOne", data, config);
  return response.data.document;
}

// get message via aggregation
export async function aggregateUserMessages({
  userId,
  database = "test",
  dataSource = "Initial",
}: AggregateUserMessagesOptions): Promise<Message[]> {
  const pipeline = [
    { $match: { _id: { $oid: userId } } }, // Match the user by ObjectId
    { $unwind: "$messages" }, // Deconstruct the messages array
    { $sort: { "messages.createdAt": -1 } }, // Sort messages by createdAt descending
    { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Re-group messages
  ];

  const data = JSON.stringify({
    collection: "users",
    database,
    dataSource,
    pipeline,
  });

  try {
    const response = await axios.post("/action/aggregate", data, config);
    return response.data.documents || [];
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw new Error("Aggregation operation failed");
  }
}
