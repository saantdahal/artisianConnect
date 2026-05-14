import { auth } from "@/app/lib/auth"; // Ensure correct import path
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
