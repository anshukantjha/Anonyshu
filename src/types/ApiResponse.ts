import { Message } from "@/lib/mongoFunction";

interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

export default ApiResponse;
