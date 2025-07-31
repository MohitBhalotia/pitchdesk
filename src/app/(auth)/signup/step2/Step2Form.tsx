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
import { z } from "zod"

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
import axios from "axios"
import signupSchemaStep2 from "@/schemas/signUpSchemaStep2"
import { toast } from "sonner"
import { useRouter } from "next/navigation"




export default function Step2Form() {

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(signupSchemaStep2),
    defaultValues: {
      role:"founder",
      company: "",
      websiteUrl: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof signupSchemaStep2>) => {
  const step1Data = JSON.parse(localStorage.getItem("step1Data") || "{}")
  console.log(step1Data)
  const step2Data = data
  console.log(step2Data)
  const finalPayload = {...step1Data, ...step2Data}
  console.log(finalPayload)
  try{
    const res = await axios.post("/api/signup", finalPayload)
    if(res.data.success){
      toast.success("User created successfully" )
      router.push("/login")
    }
  }catch(error){
    console.log(error)
    toast.error("Error creating user, please try again")
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
          <FormLabel>Select Role</FormLabel>
          <Select>
            <SelectTrigger className="w-[50%]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              
              <SelectItem value="founder">Founder</SelectItem>
              <SelectItem value="vc">VC</SelectItem>
              <SelectItem value="dark"></SelectItem>
              <SelectItem value="system"></SelectItem>
            </SelectContent>
          </Select>
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Website Url</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="e.g. you@example.com" {...field} />
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
