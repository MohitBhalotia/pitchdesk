'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'


// Schema for email validation
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ForgetPasswordPreview() {
  const [loading,setLoading]=useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSendResetLink = async () => {
    if (!form.getValues("email").trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password", { email: form.getValues("email") });
      if(res.data.success){
        toast.success("Password reset link sent to your email.");
        router.replace("/login");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong.");
    }
    finally{
      setLoading(false);
    }
  };



  return (
    <div className="min- h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
      <Card className="bg-card rounded-xl shadow-lg p-10">

        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSendResetLink)} className="space-y-8">
              <div className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center gap-4 mt-4">
                  <Button type="button" variant="outline" className="px-8 py-2 font-semibold" onClick={() => router.push('/login')}>
                    Cancel
                  </Button>
                  <Button type="submit" className="px-8 py-2 font-semibold">
                    {loading?<span className='flex gap-2 items-center'><Loader2 className='animate-spin'/>Sending...</span>:<span>Send Reset Link</span>}
                  </Button>

                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}


