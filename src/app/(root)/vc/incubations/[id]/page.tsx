"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, IndianRupee, Users, Edit, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const stageSchema = z.object({
    title: z.string().min(2, "Stage title is required"),
    description: z.string().min(5, "Stage description is required"),
    startDate: z.string(), // We will validate date format separately or trust the date input
    endDate: z.string(),
});

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
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
    cohortSize: z.string().optional(),
    status: z.enum(["draft", "published", "closed"]),
});

type IncubationFormValues = z.infer<typeof formSchema>;

interface IBot {
    _id: string;
    name: string;
}

export default function IncubationProgramDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [program, setProgram] = useState<{
        title: string;
        description: string;
        botId: { _id: string; name: string; image: string } | string;
        eligibility: string[];
        rulesAndGuidelines: string[];
        stages: { title: string; description: string; startDate: string; endDate: string }[];
        timeline: { startDate: string; endDate: string; applicationDeadline: string };
        fundingAmount?: number;
        cohortSize?: number;
        status: string;
    } | null>(null);
    const [bots, setBots] = useState<IBot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<IncubationFormValues>({
        resolver: zodResolver(formSchema),
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
        if (id) {
            fetchProgram();
            fetchBots();
        }
    }, [id]);

    const fetchProgram = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`/api/vc/incubations/${id}`);
            const prog = response.data;
            setProgram(prog);

            // Format dates for input fields
            form.reset({
                ...prog,
                botId: prog.botId?._id || prog.botId,
                startDate: prog.timeline?.startDate ? prog.timeline.startDate.split('T')[0] : "",
                endDate: prog.timeline?.endDate ? prog.timeline.endDate.split('T')[0] : "",
                applicationDeadline: prog.timeline?.applicationDeadline ? prog.timeline.applicationDeadline.split('T')[0] : "",
                cohortSize: prog.cohortSize?.toString() || "",
                fundingAmount: prog.fundingAmount?.toString() || "",
                eligibility: prog.eligibility?.map((e: string) => ({ value: e })) || [{ value: "" }],
                rulesAndGuidelines: prog.rulesAndGuidelines?.map((r: string) => ({ value: r })) || [{ value: "" }],
                stages: prog.stages && prog.stages.length > 0 ? prog.stages.map((s: { title?: string; description: string; startDate: string; endDate: string }) => ({
                    title: s.title || "",
                    description: s.description,
                    startDate: s.startDate ? new Date(s.startDate).toISOString().split('T')[0] : "",
                    endDate: s.endDate ? new Date(s.endDate).toISOString().split('T')[0] : ""
                })) : [{ title: "", description: "", startDate: "", endDate: "" }],
            });
        } catch (error: any) {
            console.error("Error fetching program:", error);
            setError(error.response?.data?.error || "Failed to load program details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBots = async () => {
        try {
            const response = await axios.get("/api/vc/bots");
            setBots(response.data);
        } catch (error) {
            console.error("Error fetching bots:", error);
        }
    };

    async function onSubmit(values: IncubationFormValues) {
        try {
            setIsSubmitting(true);

            const payload = {
                ...values,
                eligibility: values.eligibility.map((e) => e.value),
                rulesAndGuidelines: values.rulesAndGuidelines.map((r) => r.value),
                timeline: {
                    startDate: new Date(values.startDate),
                    endDate: new Date(values.endDate),
                    applicationDeadline: new Date(values.applicationDeadline),
                },
                cohortSize: values.cohortSize ? Number(values.cohortSize) : undefined,
                fundingAmount: values.fundingAmount ? Number(values.fundingAmount) : undefined,
            };

            await axios.put(`/api/vc/incubations/${id}`, payload);
            toast.success("Program updated successfully!");
            setIsEditing(false);
            fetchProgram();
        } catch (error) {
            console.error("Error updating program:", error);
            toast.error("Failed to update program.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-20 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                    <X className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Error Loading Program</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={fetchProgram} variant="outline">
                    Retry
                </Button>
            </div>
        );
    }

    if (!program) {
        return <div className="container py-10 text-center">Program not found</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <Button variant="ghost" className="pl-0" onClick={() => router.push('/vc/incubations')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
                </Button>

                {!isEditing && (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.push(`/vc/incubations/${id}/applications`)}>
                            <Users className="mr-2 h-4 w-4" /> View Applications
                        </Button>
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Program
                        </Button>
                    </div>
                )}
            </div>

            {!isEditing ? (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl mb-2">{program.title}</CardTitle>
                                    <Badge className={getStatusColor(program.status)}>
                                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Application Deadline</p>
                                    <p className="font-bold">{new Date(program.timeline.applicationDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview">
                                <TabsList className="w-full justify-start overflow-x-auto">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="bot">AI Judge</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="space-y-4 mt-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{program.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {program.fundingAmount && (
                                            <div className="p-4 bg-muted/30 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">Funding</p>
                                                <p className="text-xl font-bold break-words">₹{program.fundingAmount.toLocaleString('en-IN')}</p>
                                            </div>
                                        )}
                                        {program.cohortSize && (
                                            <div className="p-4 bg-muted/30 rounded-lg">
                                                <p className="text-sm text-muted-foreground mb-1">Cohort Size</p>
                                                <p className="text-xl font-bold">{program.cohortSize} startups</p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="space-y-4 mt-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Eligibility</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            {Array.isArray(program.eligibility) ? program.eligibility.map((item: string, i: number) => (
                                                <li key={i}>{item}</li>
                                            )) : <p>{program.eligibility}</p>}
                                        </ul>
                                    </div>
                                    {program.rulesAndGuidelines && program.rulesAndGuidelines.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Rules & Guidelines</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                {program.rulesAndGuidelines.map((item: string, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold mb-2">Program Stages</h3>
                                        <div className="space-y-4">
                                            {Array.isArray(program.stages) ? program.stages.map((stage: { title: string; description: string; startDate: string; endDate: string }, i: number) => (
                                                <div key={i} className="border p-4 rounded-lg bg-muted/20">
                                                    <h4 className="font-bold mb-1">Stage {i + 1}: {stage.title}</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                                                    <div className="text-sm text-muted-foreground flex gap-4">
                                                        <span>Start: {new Date(stage.startDate).toLocaleDateString()}</span>
                                                        <span>End: {new Date(stage.endDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            )) : <p className="whitespace-pre-wrap">{program.stages}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Timeline</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Start Date:</span>
                                                <span className="font-medium">{new Date(program.timeline.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">End Date:</span>
                                                <span className="font-medium">{new Date(program.timeline.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="bot" className="mt-4">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2">
                                                    <Image
                                                        src={typeof program.botId === 'object' ? program.botId.image : "/placeholder-avatar.png"}
                                                        alt="Agent"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{typeof program.botId === 'object' ? program.botId.name : 'AI Judge'}</h3>
                                                    <p className="text-sm text-muted-foreground">AI Evaluation Judge</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Program</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Program Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                                                    <FormLabel>AI Judge Agent</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
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
                                                        <Textarea {...field} className="min-h-[100px]" />
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
                                            <div className="space-y-2 mb-4">
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
                                            </div>

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

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="startDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Date</FormLabel>
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
                                                <FormItem>
                                                    <FormLabel>End Date</FormLabel>
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
                                                <FormItem>
                                                    <FormLabel>Application Deadline</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="fundingAmount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Funding</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <IndianRupee className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                                <Input type="number" className="pl-8" {...field} />
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
                                                            <Input type="number" {...field} />
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
                                            <div className="space-y-4 mb-4">
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
                                                                        <Input placeholder="Description" {...field} />
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

                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="published">Published</SelectItem>
                                                            <SelectItem value="closed">Closed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
