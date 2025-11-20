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

export default function Step1Form() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect");

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
    localStorage.setItem("step1Data", JSON.stringify(data));
    // Store redirect URL if it exists
    if (redirectUrl) {
      localStorage.setItem("signupRedirect", redirectUrl);
    }
    router.push("/signup/step2");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center my-10">
          <h1 className="text-3xl font-bold">Create Account</h1>
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
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
          disabled={!form.watch("privacyPolicy")}
        >
          Continue
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
          <OAuthButtons disabled={!form.watch("privacyPolicy")} />
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
              className="hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
