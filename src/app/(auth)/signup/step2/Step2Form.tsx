"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import axios, { AxiosError } from "axios";
import signupSchemaStep2, {
  SignupStep2Type,
} from "@/schemas/signUpSchemaStep2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ApiResponse from "@/types/ApiResponse";
import Link from "next/link";

export default function Step2Form() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupStep2Type>({
    resolver: zodResolver(signupSchemaStep2),
    defaultValues: {
      role: "founder",
      company: "",
      websiteUrl: "",
    },
  });

  const { data: session, status } = useSession();
  
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      localStorage.setItem("step1Data", JSON.stringify(session.user));
      console.log(session.user.email.endsWith("@gmail.com"));
      setIsGoogleUser(session.user.email.endsWith("@gmail.com")); // Simple check for Google users
    }
  }, [status, session]);

  const onSubmit = async (data: SignupStep2Type) => {
    setIsSubmitting(true);
    try {
      const step1Data = localStorage.getItem("step1Data");
      if (!step1Data) {
        toast.error("Session expired. Please start over.");
        router.push("/signup/step1");
        return;
      }

      const formData = {
        ...JSON.parse(step1Data),
        ...data,
        isGoogleUser,
      };

      console.log(formData);
      const response = await axios.post<ApiResponse>(
        "/api/auth/signup",
        formData
      );

      if (response.data.success) {
        toast.success("Account created successfully!");
        localStorage.removeItem("step1Data");
        router.push("/dashboard");
      } else {
        toast.error(response.data.message || "Failed to create account");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <div className="flex flex-col items-center gap-2 text-center my-10">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        </div>
        <div className="space-y-6 py-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="vc">VC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>

        <div className="text-sm text-center">
          <p className="text-muted-foreground">By continuing, you agree to our{" "}</p>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          <span className="text-muted-foreground">and{" "}</span>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </form>
    </Form>
  );
}
