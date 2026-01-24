"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Loader2,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Search
} from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface IApplication {
    _id: string;
    status: 'pending' | 'wishlist' | 'hold' | 'rejected' | 'accepted';
    score: number;
    submittedAt: string;
    founder: {
        fullName: string;
        email: string;
        profileImage: string;
    };
    program: {
        title: string;
    };
    pitchId: {
        title: string;
        duration: number;
    };
    botFeedback: string;
}

export default function VCPitchReviewPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchApplications();
    }, [filter, sortBy]);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/vc/pitches?status=${filter}&sortBy=${sortBy}`);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setApplications(prev => prev.map(app =>
                app._id === id ? { ...app, status: newStatus as any } : app
            ));

            await axios.put(`/api/vc/pitches/${id}`, { action: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            fetchApplications();
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            wishlist: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            hold: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        };
        return (
            <Badge className={styles[status as keyof typeof styles] || "bg-gray-100"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const filteredApplications = applications.filter(app => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            app.founder.fullName.toLowerCase().includes(query) ||
            app.program.title.toLowerCase().includes(query) ||
            app.pitchId?.title?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Pitch Reviews</h1>
                <p className="text-muted-foreground">
                    Review and manage pitch submissions from your incubation programs.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by founder, program, or pitch title..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Latest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="highest_score">Highest Score</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full mb-8">
                <TabsList>
                    <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted</TabsTrigger>
                    <TabsTrigger value="hold">On Hold</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                        {searchQuery ? "No pitches match your search." : "No pitches found for this category."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => (
                        <Card
                            key={app._id}
                            className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/vc/pitches/${app._id}`)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-3">
                                    {getStatusBadge(app.status)}
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(app.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted">
                                        <Image
                                            src={app.founder.profileImage || "/placeholder-avatar.png"}
                                            alt={app.founder.fullName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base truncate">{app.founder.fullName}</CardTitle>
                                        <CardDescription className="text-xs truncate">{app.program.title}</CardDescription>
                                    </div>
                                </div>
                                {app.pitchId?.title && (
                                    <p className="text-sm font-medium text-muted-foreground truncate">
                                        "{app.pitchId.title}"
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="flex-1 text-sm bg-muted/20 py-3 mx-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-muted-foreground">AI Score</span>
                                    <div className="flex items-center gap-1">
                                        <span className={`font-bold text-xl ${app.score >= 80 ? 'text-green-600' :
                                                app.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {app.score}
                                        </span>
                                        <span className="text-muted-foreground">/100</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                    &quot;{app.botFeedback ? app.botFeedback.substring(0, 100) : "Evaluating"}...&quot;
                                </p>
                                {app.pitchId?.duration && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Duration: {Math.floor(app.pitchId.duration / 60)}:{String(app.pitchId.duration % 60).padStart(2, '0')}
                                    </p>
                                )}
                            </CardContent>
                            <CardFooter
                                className="border-t pt-4 grid grid-cols-3 gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'accepted');
                                    }}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Accept
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'hold');
                                    }}
                                >
                                    <Clock className="h-4 w-4 mr-1" />
                                    Hold
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'rejected');
                                    }}
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
