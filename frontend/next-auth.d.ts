import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The default user fields */
      _id: string;
      name: string;
      email: string;
      role: string;
      token: string;
    };
  }
}
