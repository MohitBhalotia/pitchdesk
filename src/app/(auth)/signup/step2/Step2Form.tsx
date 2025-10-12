"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import signupSchemaStep2, { SignupStep2Type } from "@/schemas/signUpSchemaStep2"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import ApiResponse from "@/types/ApiResponse"

export default function Step2Form() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SignupStep2Type>({
    resolver: zodResolver(signupSchemaStep2),
    defaultValues: {
      role: "founder",
      company: "",
      websiteUrl: ""
    },
  })

  const { data: session, status } = useSession()
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  useEffect(() => {
    // Check if Google user is logged in - using the original logic
    if (status === "authenticated" && session?.user?.email) {
      setIsGoogleUser(true)
    }
  }, [status, session])

  const onSubmit = async (data: SignupStep2Type) => {
    setIsSubmitting(true)
    const step2Data = data

    try {
      console.log(isGoogleUser)
      if (isGoogleUser) {
        // Google sign-in user → just update (original logic)
        const res = await axios.post("/api/users/update", step2Data)
        if (res.status === 200) {
          toast.success("User details updated successfully")
          router.push("/login")
        }
      } else {
        // Step1 user (stored in localStorage) - original logic
        const step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}")
        localStorage.removeItem("step1Data")
        const finalPayload = { ...step1Data, ...step2Data }

        const res = await axios.post<ApiResponse>("/api/signup", finalPayload)

        if (res.data.success) {
          toast.success(res.data.message)
          router.push("/login")
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "an error occured while submitting details")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-center lg:text-left">Complete Your Profile</h2>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Input 
                    placeholder="https://example.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Submit"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </Form>
  )
}