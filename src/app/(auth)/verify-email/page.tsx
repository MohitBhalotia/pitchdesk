"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const FormSchema = z.object({
  pin: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export default function InputOTPForm() {

  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const code = searchParams.get("code")
  
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try{
        if(!id || !code){
          toast.error("Invalid verification link")
          return 
        }
        const res = await axios.post("/api/verify", {id, code})
        if(res.data.success){
          toast.success("Verification successfull")
          router.push("/login")
        }
      }catch(error){
        console.log(error)
        toast.error("verification failed please try again")
    }
  }

  return (
    <Form {...form} >
      <div className="min-h-screen w-screen flex items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 bg-gray-900 rounded-4xl max-w-md space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex-col items-center justify-center">
                <FormLabel className="m-auto">Verification code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="m-auto">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="m-auto">
                  Please enter the verification code sent on your registered email.
                </FormDescription>
                <FormMessage />
                <Button className="m-auto w-2xs cursor-pointer" type="submit">Submit</Button>
              </FormItem>
            )}
          />
        </form>
      </div>
    </Form>
  )
}
