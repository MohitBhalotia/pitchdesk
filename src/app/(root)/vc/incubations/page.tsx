"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface IIncubationProgram {
    _id: string;
    title: string;
    description: string;
    status: 'draft' | 'published' | 'closed';
    timeline: {
        applicationDeadline: string;
    };
    botId: {
        name: string;
        image: string; // Updated from avatarUrl
    };
    cohortSize?: number;
}

export default function VCIncubationsPage() {
    const router = useRouter();
    const [programs, setPrograms] = useState<IIncubationProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get("/api/vc/incubations");
            setPrograms(response.data);
        } catch (error) {
            console.error("Error fetching programs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incubation Programs</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your incubation cohorts, applications, and timelines.
                    </p>
                </div>
                <Button onClick={() => router.push("/vc/incubations/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Program
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                            <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                        </Card>
                    ))}
                </div>
            ) : programs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
                    <div className="p-4 rounded-full bg-muted mb-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No incubation programs found</h3>
                    <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                        Launch your first incubation program and start accepting pitches from founders.
                    </p>
                    <Button onClick={() => router.push("/vc/incubations/create")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Program
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <Card
                            key={program._id}
                            className="flex flex-col hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => router.push(`/vc/incubations/${program._id}`)}
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className={getStatusColor(program.status)} variant="secondary">
                                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Deadline: {new Date(program.timeline.applicationDeadline).toLocaleDateString()}
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-1">{program.title}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {program.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-sm">
                                    <div className="relative h-8 w-8 rounded-full overflow-hidden border">
                                        <Image
                                            src={program.botId?.image || "/placeholder-avatar.png"}
                                            alt="Bot"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Evaluated by</p>
                                        <p className="font-medium truncate">{program.botId?.name || "AI Judge"}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-4 flex justify-between items-center text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{program.cohortSize || "Unlimited"} spots</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/vc/incubations/${program._id}`);
                                    }}
                                >
                                    Manage
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
