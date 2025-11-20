"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"
import { REGEXP_ONLY_DIGITS } from "input-otp"
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

export default function VerifyEmail() {

  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams?.get("id")
  const code = searchParams?.get("code")
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: code||"",
    },
  })

  
  
  
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const code = data.pin
    try{
        if(!id || !code){
          toast.error("Invalid verification link")
          return 
        }
        const res = await axios.post("/api/auth/verify", {id, code})
        if(res.data.success){
          toast.success("Verification successfull")
          router.push("/login")
        }
      }catch(error){
        toast.error("verification failed please try again")
        console.log(error)
    }
  }

  return (
    <Form {...form} >
      <div className="min-h-screen w-screen flex items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6 bg-card border rounded-4xl max-w-md space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="flex-col items-center justify-center">
                <FormLabel className="mx-auto mb-10 text-2xl font-bold">Verification code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field} className="mx-auto ">
                    <InputOTPGroup className="m-auto">
                      <InputOTPSlot index={0} className="h-11"/>
                      <InputOTPSlot index={1} className="h-11"/>
                      <InputOTPSlot index={2} className="h-11"/>
                      <InputOTPSlot index={3} className="h-11"/>
                      <InputOTPSlot index={4} className="h-11"/>
                      <InputOTPSlot index={5} className="h-11"/>
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="mx-auto my-4">
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
