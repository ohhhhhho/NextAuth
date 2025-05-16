import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { User } from "../typescript/user"

//타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: 'admin' | 'user';
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: 'admin' | 'user';
  }
}