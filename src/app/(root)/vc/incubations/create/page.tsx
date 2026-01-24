"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    botId: z.string().min(1, "Please select a bot"),
    eligibility: z.string().min(5, "Eligibility criteria is required"),
    stages: z.string().min(5, "Please describe the stages"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    applicationDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    fundingAmount: z.string().optional(),
    equityExpectations: z.string().optional(),
    cohortSize: z.preprocess((val) => Number(val), z.number().min(1).optional()),
    notes: z.string().optional(),
    status: z.enum(["draft", "published"]),
});

interface IVCBot {
    _id: string;
    name: string;
}

export default function CreateIncubationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bots, setBots] = useState<IVCBot[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            eligibility: "",
            stages: "",
            fundingAmount: "",
            equityExpectations: "",
            notes: "",
            status: "draft",
        },
    });

    useEffect(() => {
        // Fetch bots for selection
        axios.get("/api/vc/bots").then((res) => {
            setBots(res.data);
        }).catch(err => console.error(err));
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            await axios.post("/api/vc/incubations", values);
            toast.success("Incubation program created successfully!");
            router.push("/vc/incubations");
            router.refresh();
        } catch (error) {
            console.error("Error creating incubation:", error);
            toast.error("Failed to create incubation program.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create Incubation Program</h1>
                <p className="text-muted-foreground mt-1">
                    Launch a new program to find and support the next big startups.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Program Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Winter 2026 SaaS Cohort" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="botId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AI Judge Bot</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a bot to evaluate pitches" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {bots.map((bot) => (
                                                    <SelectItem key={bot._id} value={bot._id}>
                                                        {bot.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            This bot will automatically evaluate all pitch submissions.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="What is this program about?"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="eligibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Eligibility Criteria</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Who can apply?"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6">
                            {/* Date Pickers - Replaced with Native Input */}
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Program Start Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Program End Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="applicationDeadline"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Application Deadline</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fundingAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Funding Amount</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="100000" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cohortSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cohort Size</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" placeholder="10" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="stages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Program Stages</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the interview rounds or program phases..."
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Program
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}
