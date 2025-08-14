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
//import { z } from "zod"

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
    // Check if Google user is logged in
    
        if (status === "authenticated" && session?.user?.email) {
      setIsGoogleUser(true)
        }
  }, [status, session])

  const onSubmit = async (data: SignupStep2Type) => {
    const step2Data = data

    try {
      console.log(isGoogleUser)
      if (isGoogleUser) {
        // Google sign-in user → just update
        const res = await axios.post("/api/users/update", step2Data)
        if (res.status === 200) {
          toast.success("User details updated successfully")
          router.push("/login")
        }
      } else {
        // Step1 user (stored in localStorage)
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
      toast.error("Error submitting details")
    }
  }

  return (
    <Form {...form}>
      <div className="min-h-screen w-screen flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-8 bg-gray-800 p-10 rounded-3xl shadow-lg text-white"
        >
          <h2 className="text-2xl font-bold text-center">Company Details</h2>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[50%]">
                      <SelectValue placeholder="Role" />
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
                  <Input placeholder="e.g. Microsoft" {...field} />
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
                  <Input placeholder="e.g. https://microsoft.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button type="submit" className="w-1/2">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Form>
  )
}
