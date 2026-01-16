import apiClient from "@/utils/apiClient";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await apiClient.post(`/api/auth/login`, {
          email: credentials.email,
          password: credentials.password,
        });

        return {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          token: res.data.token,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const res = await apiClient.post(`/api/auth/google`, {
          email: user.email,
          name: user.name,
        });
        token.token = res.data.token;
        token._id = res.data._id;
        token.role = res.data.role ?? "user";
        token.name = res.data.name;
        token.email = res.data.email;
      } else if (user) {
        const u = user as Partial<{ _id: string; name: string; email: string; role: string; token: string }>;
        token = {
          ...token,
          _id: u._id ?? "",
          name: u.name ?? "",
          email: u.email ?? "",
          role: u.role ?? "user",
          token: u.token ?? "",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        _id: token._id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        token: token.token as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
