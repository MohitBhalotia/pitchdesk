"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import signupSchemaStep1 from "@/schemas/signUpSchemaStep1";
import OAuthButtons from "@/components/oauth-button";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";

function Step1FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get("role") as "founder" | "vc" | null;
  const redirectUrl = searchParams?.get("redirect");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!role || (role !== "founder" && role !== "vc")) {
      router.replace("/signup");
    }
  }, [role, router]);

  const form = useForm({
    resolver: zodResolver(signupSchemaStep1),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchemaStep1>) => {
    setIsSubmitting(true);
    try {
      const finalPayload = {
        ...data,
        role: role,
        company: "",
        websiteUrl: "",
      };

      const res = await axios.post<ApiResponse>("/api/auth/signup", finalPayload);
      
      if (res.data.success) {
        if (role === "vc") {
          router.push("/verification-pending");
          toast.success(
            "Thank you for registering as a Venture Capitalist! Our team will verify your VC account and contact you soon."
          );
        } else {
          // Store redirect URL for after email verification and login
          if (redirectUrl) {
            sessionStorage.setItem("postVerifyRedirect", redirectUrl);
          }
          router.push("/verify-email?id=" + res.data?.data);
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "An error occurred while creating your account"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!role) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center my-10">
          <h1 className="text-3xl font-bold">
            {role === "founder" ? "Create Founder Account" : "Create Investor Account"}
          </h1>
          {/* <p className="text-muted-foreground text-sm">
            {role === "founder" 
              ? "Join PitchDesk to refine your pitch and connect with investors." 
              : "Discover promising startups and manage your investment pipeline."}
          </p> */}
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I understand the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!form.watch("privacyPolicy") || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <OAuthButtons disabled={!form.watch("privacyPolicy") || isSubmitting} />
          {!form.watch("privacyPolicy") && (
            <p className="text-xs text-center text-muted-foreground">
              Please accept the Privacy Policy to continue
            </p>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm ">
            Already have an account?{" "}
            <Link
              href={
                redirectUrl
                  ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
                  : "/login"
              }
              className="hover:underline text-primary font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}

export default function Step1Form() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Step1FormContent />
    </Suspense>
  );
}
