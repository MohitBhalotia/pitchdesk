"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    sector: z.string().min(2, "Sector is required"),
    fundSize: z.string().min(1, "Fund size is required"),
    investmentStage: z.string().min(1, "Investment stage is required"),
    geographicFocus: z.string().optional(),
    userInstructions: z.string().min(20, "Please provide detailed evaluation criteria"),
});

export default function CreateBotPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [generatedAvatars, setGeneratedAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("");
    const [isGeneratingAvatars, setIsGeneratingAvatars] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            sector: "",
            fundSize: "",
            investmentStage: "",
            geographicFocus: "",
            userInstructions: "",
        },
    });

    const generateAvatars = async () => {
        setIsGeneratingAvatars(true);
        setTimeout(() => {
            const botName = form.getValues("name") || "Bot";
            setGeneratedAvatars([
                `https://ui-avatars.com/api/?name=${encodeURIComponent(botName)}&background=0D8ABC&color=fff&size=256`,
                `https://ui-avatars.com/api/?name=${encodeURIComponent(botName)}&background=667EEA&color=fff&size=256`,
                `https://ui-avatars.com/api/?name=${encodeURIComponent(botName)}&background=F56565&color=fff&size=256`,
            ]);
            setIsGeneratingAvatars(false);
        }, 1500);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (step === 1) {
            setStep(2);
            if (generatedAvatars.length === 0) generateAvatars();
            return;
        }

        if (!selectedAvatar) {
            toast.error("Please select an avatar for your bot");
            return;
        }

        try {
            setIsSubmitting(true);

            // Generate system prompt via API
            const promptResponse = await axios.post("/api/generate-agent-prompt", values);
            const { systemPrompt, firstMessage, voice } = promptResponse.data;

            // Create bot with generated prompts
            await axios.post("/api/vc/bots", {
                ...values,
                systemPrompt,
                firstMessage,
                voice,
                avatarUrl: selectedAvatar,
            });

            toast.success("AI Judge Bot created successfully!");
            router.push("/vc/bots");
            router.refresh();
        } catch (error) {
            console.error("Error creating bot:", error);
            toast.error("Failed to create bot. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Create AI Judge Bot</h1>
                <p className="text-muted-foreground mt-1">
                    Design a custom AI persona to evaluate pitches for your incubation programs.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Progress */}
                <div className="flex items-center gap-4 mb-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'} font-bold`}>1</div>
                    <div className="h-1 flex-1 bg-muted">
                        <div className={`h-full bg-primary transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
                    </div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'} font-bold`}>2</div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{step === 1 ? "Investment Focus & Criteria" : "Bot Appearance"}</CardTitle>
                        <CardDescription>
                            {step === 1 ? "Define your investment preferences and evaluation approach." : "Select an avatar for your AI judge."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {step === 1 && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bot Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Strategic Growth Partner" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bot Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief background of this VC persona..."
                                                            className="min-h-[80px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="sector"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Sector Focus</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select sector" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="SaaS">SaaS</SelectItem>
                                                                <SelectItem value="Fintech">Fintech</SelectItem>
                                                                <SelectItem value="HealthTech">HealthTech</SelectItem>
                                                                <SelectItem value="EdTech">EdTech</SelectItem>
                                                                <SelectItem value="DeepTech">DeepTech</SelectItem>
                                                                <SelectItem value="Consumer">Consumer</SelectItem>
                                                                <SelectItem value="Enterprise">Enterprise</SelectItem>
                                                                <SelectItem value="Climate">Climate Tech</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="investmentStage"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Investment Stage</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select stage" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                                                <SelectItem value="Seed">Seed</SelectItem>
                                                                <SelectItem value="Series A">Series A</SelectItem>
                                                                <SelectItem value="Series B+">Series B+</SelectItem>
                                                                <SelectItem value="Growth">Growth Stage</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="fundSize"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Typical Check Size</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select range" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="$50K - $250K">$50K - $250K</SelectItem>
                                                                <SelectItem value="$250K - $1M">$250K - $1M</SelectItem>
                                                                <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                                                                <SelectItem value="$5M+">$5M+</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="geographicFocus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Geographic Focus (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. North America, Global" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="userInstructions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Evaluation Criteria & Instructions</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe what you look for in startups, your evaluation approach, key questions you want the bot to ask, deal-breakers, etc..."
                                                            className="min-h-[120px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        This will shape how your AI judge evaluates pitches. Be specific about priorities.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Select Avatar</p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={generateAvatars}
                                                    disabled={isGeneratingAvatars}
                                                >
                                                    {isGeneratingAvatars ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
                                                    Regenerate
                                                </Button>
                                            </div>

                                            {isGeneratingAvatars ? (
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[1, 2, 3].map(i => <Skeleton key={i} className="aspect-square rounded-full w-full" />)}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-6">
                                                    {generatedAvatars.map((url, i) => (
                                                        <div
                                                            key={i}
                                                            className={`relative aspect-square rounded-full overflow-hidden border-4 cursor-pointer transition-all ${selectedAvatar === url ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-muted'}`}
                                                            onClick={() => setSelectedAvatar(url)}
                                                        >
                                                            <Image src={url} alt={`Avatar ${i + 1}`} fill className="object-cover" />
                                                            {selectedAvatar === url && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                    <div className="bg-primary text-white p-2 rounded-full">
                                                                        <User className="h-6 w-6" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between pt-4">
                                    {step === 2 ? (
                                        <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                            Back
                                        </Button>
                                    ) : (
                                        <div />
                                    )}

                                    {step === 1 ? (
                                        <Button type="submit">
                                            Next: Select Avatar
                                        </Button>
                                    ) : (
                                        <Button type="submit" disabled={isSubmitting || !selectedAvatar}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create Bot
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
