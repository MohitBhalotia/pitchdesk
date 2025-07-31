"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import signupSchemaStep1 from "@/schemas/signUpSchemaStep1"

export default function Step1Form() {
  const router = useRouter()
  
  const form = useForm({
    resolver: zodResolver(signupSchemaStep1),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signupSchemaStep1>) => {
  localStorage.setItem("step1Data",JSON.stringify(data))
  router.push("/signup/step2")
  }

  return (
    <Form {...form}>
      <div className="min-h-screen w-screen flex items-center justify-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl bg-gray-800 text-white p-10 rounded-3xl shadow-lg space-y-8"
        >
          <h2 className="text-2xl font-bold text-center">Create Account</h2>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Prathamesh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button type="submit" className="w-1/2">Submit</Button>
          </div>
        </form>
      </div>
    </Form>
  )
}


