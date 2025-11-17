// src/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import { authOptions } from "./options.ts";
import dbConnection from "@/lib/db-connect.ts";

await dbConnection();
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };