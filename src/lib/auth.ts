import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import UserModel from "@/models/UserModel";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/db";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { createFreeUserPlan } from "@/lib/razorpayUtils";

const salt=await bcrypt.genSalt(10);

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          fullName: profile.name || "",
          email: profile.email || "",
          isVerified: true,
          provider: "google",
          signupStep2Done: false
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials?.email,
          });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("You are not verified. Please verify your email.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password as string,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid credentials. Please try again.");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = new UserModel({
            fullName: user.fullName as string,
            email: user.email as string,
            password: await bcrypt.hash(nanoid(8), salt),
            isVerified: true,
            verificationCode: null,
            verificationExpiry: null,
            role: "founder",
            userPlan: "free",
            resetPasswordToken: null,
            provider: "google",
          });


          await newUser.save();

          // Create free user plan for new Google users
          await createFreeUserPlan(newUser._id.toString());

          user._id = newUser._id?.toString();
          user.isVerified = true;
          user.fullName = newUser.fullName;
          user.email = newUser.email;
          user.role = "founder";
          user.userPlan = "free";
        } else {
          user._id = existingUser._id?.toString();
          user.isVerified = existingUser.isVerified;
          user.fullName = existingUser.fullName;
          user.email = existingUser.email;
          user.role = existingUser.role;
          user.userPlan = existingUser.userPlan;
          user.provider = existingUser.provider;
          user.signupStep2Done = existingUser.signupStep2Done;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.fullName = user.fullName;
        token.email = user.email;
        token.role = user.role;
        token.userPlan = user.userPlan;
        token.provider = user.provider;
        token.signupStep2Done = user.signupStep2Done;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.fullName = token.fullName;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.userPlan = token.userPlan;
        session.user.provider = token.provider;
        session.user.signupStep2Done = token.signupStep2Done;
      }
      return session;
    },
  },
};

export default authOptions