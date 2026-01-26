"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const applicationSchema = z.object({
    startupName: z.string().min(2, "Startup name must be at least 2 characters"),
    founderName: z.string().min(2, "Founder name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    industry: z.string().min(1, "Please select an industry"),
    stage: z.enum(["idea", "mvp", "early_revenue", "growth", "scaling"]),
    teamSize: z.string().min(1, "Team size is required"),
    description: z.string()
        .min(50, "Description must be at least 50 characters")
        .max(500, "Description must not exceed 500 characters"),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    fundingRaised: z.string().optional(),
    motivation: z.string()
        .min(50, "Motivation must be at least 50 characters")
        .max(300, "Motivation must not exceed 300 characters"),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pitchId: string;
    programId: string;
    onSuccess: () => void;
}

export default function ApplicationSubmissionDialog({
    open,
    onOpenChange,
    pitchId,
    programId,
    onSuccess,
}: ApplicationDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            startupName: "",
            founderName: "",
            email: "",
            phone: "",
            industry: "",
            stage: undefined,
            teamSize: "",
            description: "",
            website: "",
            linkedin: "",
            fundingRaised: "",
            motivation: "",
        },
    });

    const onSubmit = async (values: ApplicationFormValues) => {
        try {
            setIsSubmitting(true);

            const payload = {
                pitchId,
                registrationData: {
                    ...values,
                    teamSize: parseInt(values.teamSize),
                },
            };

            await axios.post(`/api/incubations/${programId}/submit-application`, payload);

            toast.success("Application submitted successfully!");
            form.reset();
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error("Error submitting application:", error);
            toast.error(error.response?.data?.error || "Failed to submit application");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Submit Application</DialogTitle>
                    <DialogDescription>
                        Complete your application by providing details about your startup.
                        All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Startup Name */}
                            <FormField
                                control={form.control}
                                name="startupName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Startup Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Acme Inc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Founder Name */}
                            <FormField
                                control={form.control}
                                name="founderName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Founder Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="founder@startup.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 8900" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Industry */}
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. SaaS, FinTech, HealthTech" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Stage */}
                            <FormField
                                control={form.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Startup Stage *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select stage" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="idea">Idea</SelectItem>
                                                <SelectItem value="mvp">MVP</SelectItem>
                                                <SelectItem value="early_revenue">Early Revenue</SelectItem>
                                                <SelectItem value="growth">Growth</SelectItem>
                                                <SelectItem value="scaling">Scaling</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Team Size */}
                            <FormField
                                control={form.control}
                                name="teamSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Size *</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" placeholder="e.g. 5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Funding Raised */}
                            <FormField
                                control={form.control}
                                name="fundingRaised"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Funding Raised (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. $100K" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Leave blank if bootstrapped
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Startup Description *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe your startup, what problem you're solving, and your solution..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0}/500 characters (min 50)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Motivation */}
                        <FormField
                            control={form.control}
                            name="motivation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Why this program? *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Why are you interested in this incubation program? What do you hope to achieve?"
                                            className="min-h-[80px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {field.value?.length || 0}/300 characters (min 50)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Website */}
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://yourstartup.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* LinkedIn */}
                        <FormField
                            control={form.control}
                            name="linkedin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
