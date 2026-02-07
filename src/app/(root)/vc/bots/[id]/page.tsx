"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface IAgent {
    _id: string;
    name: string;
    description: string;
    image: string;
    sector: string[];
    fundSize: string;
    investmentStage: string[];
    geographicFocus?: string;
    userInstructions: string;
    isActive: boolean;
    createdAt: string;
}

export default function AgentDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [bot, setBot] = useState<IAgent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchBot();
        }
    }, [id]);

    const fetchBot = async () => {
        try {
            const response = await axios.get(`/api/vc/bots/${id}`);
            setBot(response.data);
        } catch (error) {
            console.error("Error fetching bot:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!bot) {
        return <div className="container py-10 text-center">Agent not found</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Button variant="ghost" className="mb-6 pl-0" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Agents
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
                                    <Image src={bot.image} alt={bot.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">{bot.name}</CardTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={bot.isActive ? "default" : "secondary"}>
                                            {bot.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        {bot.sector && bot.sector.map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{bot.description}</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-3">Investment Focus</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sector</p>
                                        <p className="font-medium">{Array.isArray(bot.sector) ? bot.sector.join(", ") : bot.sector}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Stage</p>
                                        <p className="font-medium">{Array.isArray(bot.investmentStage) ? bot.investmentStage.join(", ") : bot.investmentStage}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Check Size</p>
                                        <p className="font-medium">{bot.fundSize}</p>
                                    </div>
                                    {bot.geographicFocus && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Geography</p>
                                            <p className="font-medium">{bot.geographicFocus}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Agent Personality</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{bot.userInstructions}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Agent Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">{new Date(bot.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Pitches Evaluated</p>
                                <p className="font-medium">Coming Soon</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Used in Programs</p>
                                <p className="font-medium">Coming Soon</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Bot className="h-5 w-5" /> AI Personality
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                This agent uses an AI-generated personality optimized for {Array.isArray(bot.sector) ? bot.sector.join(", ") : bot.sector} startups at the {Array.isArray(bot.investmentStage) ? bot.investmentStage.join(", ") : bot.investmentStage} stage.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
