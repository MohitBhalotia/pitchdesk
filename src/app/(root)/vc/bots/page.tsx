"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface IAgent {
    _id: string;
    name: string;
    description?: string;
    image: string; // From AgentModel
    domainFocus?: string;
    isActive: boolean;
}

export default function VCBotsPage() {
    const router = useRouter();
    const [bots, setBots] = useState<IAgent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBots();
    }, []);

    const fetchBots = async () => {
        try {
            const response = await axios.get("/api/vc/bots");
            setBots(response.data);
        } catch (error) {
            console.error("Error fetching bots:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My AI VC Agents</h1>
                    <p className="text-muted-foreground mt-1">
                        Create and manage your custom AI judge personalities.
                    </p>
                </div>
                <Button onClick={() => router.push("/vc/bots/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Agent
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-16 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : bots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/10 border-dashed">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No agents created yet</h3>
                    <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                        Get started by creating your first AI VC judge to evaluate pitches automatically.
                    </p>
                    <Button onClick={() => router.push("/vc/bots/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Agent
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map((bot) => (
                        <Card
                            key={bot._id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/vc/bots/${bot._id}`)}
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full border">
                                        <Image
                                            src={bot.image || "/placeholder-avatar.png"}
                                            alt={bot.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">
                                            {bot.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {bot.domainFocus}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-4">
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {bot.description || "No description provided."}
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${bot.isActive
                                            ? "bg-mint/30 text-mint-deep ring-mint-deep/30"
                                            : "bg-red-50 text-red-700 ring-red-600/20"
                                            }`}
                                    >
                                        {bot.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
