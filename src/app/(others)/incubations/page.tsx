"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CreateIncubation from "@/components/mvpblocks/create-incubation";
interface IIncubationProgram {
    _id: string;
    title: string;
    organizationName: string;
    description: string;
    timeline: {
        applicationDeadline: string;
    };
    status: string;
}

export default function IncubationListPage() {
    const router = useRouter();
    const [programs, setPrograms] = useState<IIncubationProgram[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get("/api/incubations");
            setPrograms(response.data);
        } catch (error) {
            console.error("Error fetching investment programs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-20">
            <div className="mb-8 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Investment Programs
                </h1>
                <p className="text-lg text-muted-foreground">
                    Fast track your startup journey. Apply to top investment programs and get evaluated by AI VC judges instantly.
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                            <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                        </Card>
                    ))}
                </div>
            ) : programs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No active investment programs found at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {programs.map((program) => (
                        <Card key={program._id} className="flex flex-col hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                                        <Briefcase className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{program.organizationName}</p>
                                        <p className="text-xs text-muted-foreground">Investment Center</p>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">{program.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3 mb-4">
                                    {program.description}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground gap-2 bg-muted/50 p-2 rounded">
                                    <Calendar className="h-4 w-4" />
                                    <span>Deadline: {new Date(program.timeline.applicationDeadline).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t">
                                <Button
                                    className="w-full group"
                                    onClick={() => router.push(`/incubations/${program._id}`)}
                                >
                                    View Details
                                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>


            )}
            <CreateIncubation />
        </div>
    );
}
