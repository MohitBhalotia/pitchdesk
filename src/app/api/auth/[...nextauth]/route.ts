import NextAuth from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/lib/db";
// import { env } from "@/env.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token, user }) {
      // Try to get provider from token (if available)
      if (token?.provider) {
        session.user.provider = token.provider;
      } else if (user?.provider) {
        session.user.provider = user.provider;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account?.provider) {
        token.provider = account.provider;
      } else if (user?.provider) {
        token.provider = user.provider;
      }
      return token;
    },
  },
  providers: [
    // AppleProvider({
    //   clientId: process.env.APPLE_ID!,
    //   clientSecret: process.env.APPLE_SECRET!,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID!,
    //   clientSecret: process.env.FACEBOOK_SECRET!,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_ID!,
      clientSecret: process.env.GOOGLE_AUTH_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Replace this with your own logic to validate user
        // For demo: accept any non-empty email and password
        if (credentials?.email && credentials?.password) {
          // You can fetch user from DB here
          return { id: credentials.email, email: credentials.email };
        }
        // If login fails, return null
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

// Ensure DB connection before NextAuth handler
const handler = async (...args: any) => {
  await dbConnect();
  // @ts-ignore
  return NextAuth(authOptions)(...args);
};

export { handler as GET, handler as POST };
