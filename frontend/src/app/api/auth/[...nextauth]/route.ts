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
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
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
      if (user?.token) {
        token.backendToken = user.token;
        return token;
      }

      if (account?.provider === "google" && user?.email) {
        const res = await apiClient.post(`/api/auth/google`, {
          email: user.email,
          name: user.name,
        });
      }

      return token;
    },
    async session({ session }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
