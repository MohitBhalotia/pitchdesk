'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

// Define the form schema for each step
const signupSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['founder', 'vc'], { message: 'Role is required' }),
  company: z.string().min(2, 'Company name is required'),
  websiteURL: z.string().url('Please enter a valid company website URL'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const formSchema = signupSchema;


type FormData = z.infer<typeof formSchema>;

interface MultiStepFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

export default function MultiStepForm({
  className,
  onSubmit,
}: MultiStepFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Define the steps
  const steps = [
  {
    id: 'account',
    title: 'Account Details',
    description: 'Create your account',
    schema: formSchema,
    fields: [
      {
        name: 'fullname',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john.doe@example.com',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: '••••••••',
      },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'founder', label: 'Founder' },
          { value: 'vc', label: 'VC' },
        ],
        placeholder: 'Select role',
      },
      {
        name: 'company',
        label: 'Company Name',
        type: 'text',
        placeholder: 'Company name',
      },
      {
        name: 'websiteURL',
        label: 'Company Website URL',
        type: 'text',
        placeholder: 'https://example.com',
      },
    ],
  },
];

  // Get the current step schema
  const currentStepSchema = steps[step].schema as z.ZodType<any, any, any>;

  // Setup form with the current step schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: formData,
  });

  // Calculate progress percentage
  const progress = ((step + 1) / steps.length) * 100;

  // Handle next step
  const handleNextStep = async (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      // Reset form with the updated data for the next step
      reset(updatedData);
    } else {
      // Final step submission
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullname: updatedData.fullname,
            email: updatedData.email,
            password: updatedData.password,
            role: updatedData.role,
            company: updatedData.company,
            websiteURL: updatedData.websiteURL,
          }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Signup failed');
        }
        // Auto-login after signup
        const signInRes = await (await import('next-auth/react')).signIn('credentials', {
          email: updatedData.email,
          password: updatedData.password,
          redirectUrl: '/dashboard',
        });
        if (signInRes?.ok) {
        
        } else {
          alert('Signup succeeded, but login failed. Please login manually.');
        }
      } catch (error: any) {
        alert(error.message || 'Signup failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div
      className={cn(
        'bg-card/40 mx-auto w-full max-w-md rounded-lg p-6 shadow-lg',
        className,
      )}
    >
      {!isComplete ? (
        <>
          {/* Sign up with Google button */}
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => (window as any).signIn ? (window as any).signIn('google') : import('next-auth/react').then(mod => mod.signIn('google'))}
              className="border-border bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-10 py-2.5 text-sm shadow-sm"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="h-5 w-5"
                alt="Google"
              />
              <span className="ml-2">Sign up with Google</span>
            </button>
          </div>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">
                Step {step + 1} of {steps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="mb-8 flex justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                    i < step
                      ? 'bg-primary text-primary-foreground'
                      : i === step
                        ? 'bg-primary text-primary-foreground ring-primary/30 ring-2'
                        : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="mt-1 hidden text-xs sm:block">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">{steps[step].title}</h2>
                <p className="text-muted-foreground text-sm">
                  {steps[step].description}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(handleNextStep)}
                className="space-y-4"
              >
                {steps[step].fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        {...register(field.name as any)}
                        className={cn(
                          'block w-full rounded-lg border py-3 pr-3 pl-3 text-sm',
                          errors[field.name as string] && 'border-destructive',
                        )}
                        defaultValue=""
                      >
                        <option value="" disabled>{field.placeholder}</option>
                        {field.options?.map((opt: any) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name as any)}
                        className={cn(
                          errors[field.name as string] && 'border-destructive',
                        )}
                      />
                    )}
                    {errors[field.name as string] && (
                      <p className="text-destructive text-sm">
                        {errors[field.name as string]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 0}
                    className={cn(step === 0 && 'invisible')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {step === steps.length - 1 ? (
                      isSubmitting ? (
                        'Submitting...'
                      ) : (
                        'Submit'
                      )
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="py-10 text-center"
        >
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Form Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for completing the form. We&apos;ll be in touch soon.
          </p>
          <Button
            onClick={() => {
              setStep(0);
              setFormData({});
              setIsComplete(false);
              reset({});
            }}
          >
            Start Over
          </Button>
        </motion.div>
      )}
    </div>
  );
}
