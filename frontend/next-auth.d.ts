import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The default user fields */
      name?: string | null;
      email?: string | null;
      image?: string | null;

      /** Custom field for backend token */
      backendToken?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    /** Custom field for backend token */
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
  }
}
