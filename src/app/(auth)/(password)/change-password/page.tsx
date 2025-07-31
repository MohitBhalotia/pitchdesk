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

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

const formSchema = z.object({
    currentPassword: z.string().min(8, "Current password must be at least 8 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
})

export default function ResetPasswordPreview() {
    const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })


  
  const [loading,setLoading]=useState(false);
  const handleReset = async (values: z.infer<typeof formSchema>) => {
   
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.password,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to change password.");
    }finally{
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md bg-card rounded-xl shadow-lg p-10">

        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            If you wish to change your password, you can change from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleReset)} className="space-y-8">
              <div className="grid gap-4">
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 mt-2">
                      <FormLabel >Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          id="currentPassword"
                          placeholder="••••••••"
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
                    <FormItem className="grid gap-2 mt-2">
                      <FormLabel >New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          id="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 mt-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          id="confirmPassword"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-4">
                  {loading?<span className='flex items-center gap-2'><Loader2 className='animate-spin'/></span>:<span>Change Password</span>}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
