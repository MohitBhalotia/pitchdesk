"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, IndianRupee, Users, Plus, Trash2, X } from "lucide-react";
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

const stageSchema = z.object({
    title: z.string().min(2, "Stage title is required"),
    description: z.string().min(5, "Stage description is required"),
    startDate: z.string(), // We will validate date format separately or trust the date input
    endDate: z.string(),
});

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    organizationName: z.string().min(2, "Organization name is required"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    botId: z.string().min(1, "Please select an agent"),
    eligibility: z.array(z.object({ value: z.string().min(5, "Criteria must be at least 5 chars") })),
    rulesAndGuidelines: z.array(z.object({ value: z.string().min(5, "Rule must be at least 5 chars") })),
    stages: z.array(stageSchema).min(1, "At least one stage is required"),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    applicationDeadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    fundingAmount: z.string().refine((val) => !isNaN(Number(val)), { message: "Must be a valid number" }).optional(),
    equityExpectations: z.string().optional(),
    cohortSize: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(["draft", "published"]),
});

type IncubationFormValues = z.infer<typeof formSchema>;

interface IVCBot {
    _id: string;
    name: string;
}

export default function CreateIncubationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bots, setBots] = useState<IVCBot[]>([]);

    const form = useForm<IncubationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            organizationName: "",
            description: "",
            botId: "",
            eligibility: [{ value: "" }],
            rulesAndGuidelines: [{ value: "" }],
            stages: [{ title: "", description: "", startDate: "", endDate: "" }],
            startDate: "",
            endDate: "",
            applicationDeadline: "",
            fundingAmount: "",
            equityExpectations: "",
            notes: "",
            status: "draft" as const,
        },
    });

    const { fields: eligibilityFields, append: appendEligibility, remove: removeEligibility } = useFieldArray({
        control: form.control,
        name: "eligibility",
    });

    const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
        control: form.control,
        name: "rulesAndGuidelines",
    });

    const { fields: stageFields, append: appendStage, remove: removeStage } = useFieldArray({
        control: form.control,
        name: "stages",
    });

    useEffect(() => {
        // Fetch bots for selection
        axios.get("/api/vc/bots").then((res) => {
            setBots(res.data);
        }).catch(err => console.error(err));
    }, []);

    async function onSubmit(values: IncubationFormValues) {
        try {
            setIsSubmitting(true);

            // Transform the data to match the API expected format
            const payload = {
                title: values.title,
                organizationName: values.organizationName,
                description: values.description,
                botId: values.botId,
                eligibility: values.eligibility.map((e) => e.value),
                rulesAndGuidelines: values.rulesAndGuidelines.map((r) => r.value),
                stages: values.stages,
                timeline: {
                    startDate: new Date(values.startDate),
                    endDate: new Date(values.endDate),
                    applicationDeadline: new Date(values.applicationDeadline),
                },
                fundingAmount: values.fundingAmount ? Number(values.fundingAmount) : undefined,
                equityExpectations: values.equityExpectations,
                cohortSize: values.cohortSize ? Number(values.cohortSize) : undefined,
                notes: values.notes,
                status: values.status,
            };

            await axios.post("/api/vc/incubations", payload);
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
                                name="organizationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Y Combinator, Techstars" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The name of your incubation center/firm (shown to founders for privacy)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="botId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AI Judge Agent</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an agent to evaluate pitches" />
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
                                            This agent will automatically evaluate all pitch submissions.
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

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>Eligibility Criteria</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendEligibility({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Point
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {eligibilityFields.map((field, index) => (
                                        <FormField
                                            key={field.id}
                                            control={form.control}
                                            name={`eligibility.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <Input placeholder="Criteria..." {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeEligibility(index)}
                                                        disabled={eligibilityFields.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <FormMessage>
                                        {form.formState.errors.eligibility?.root?.message}
                                    </FormMessage>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>Rules & Guidelines</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendRule({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Rule
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {ruleFields.map((field, index) => (
                                        <FormField
                                            key={field.id}
                                            control={form.control}
                                            name={`rulesAndGuidelines.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 space-y-0">
                                                    <FormControl>
                                                        <Input placeholder="Rule..." {...field} />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeRule(index)}
                                                        disabled={ruleFields.length === 1}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
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
                                                    <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" placeholder="100000" className="pl-8" {...field} />
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

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>Program Stages</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendStage({ title: "", description: "", startDate: "", endDate: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Stage
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {stageFields.map((field, index) => (
                                        <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-medium">Stage {index + 1}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => removeStage(index)}
                                                    disabled={stageFields.length === 1}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name={`stages.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Stage Title (e.g. Registration)" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`stages.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Stage Description (e.g. Initial Screening)" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`stages.${index}.startDate`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Start Date</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`stages.${index}.endDate`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">End Date</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="w-[200px]">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Save as Draft</SelectItem>
                                            <SelectItem value="published">Publish Now</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Program
                            </Button>
                        </div>
                    </div>

                </form>
            </Form>
        </div>
    );
}
