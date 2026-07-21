"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Search,
    TrendingUp,
    Download
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface IApplication {
    _id: string;
    status: 'pending' | 'wishlist' | 'hold' | 'rejected' | 'accepted';
    score: number;
    submittedAt: string;
    founderId: {
        fullName: string;
        email: string;
        profileImage: string;
    };
    program: {
        _id: string;
        title: string;
    };
    pitchId: {
        _id: string;
        title: string;
        duration: number;
    };
    registrationData: {
        startupName: string;
        founderName: string;
        email: string;
        phone: string;
        industry: string;
        stage: string;
        teamSize: number;
        description: string;
        website?: string;
        linkedin?: string;
        fundingRaised?: string;
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

    const handleExport = async (status: string) => {
        try {
            const params = new URLSearchParams({ status });
            const response = await axios.get(`/api/vc/pitches/export?${params}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pitches-${status}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Export failed. Please try again.");
        }
    };

    const updateStatus = async (id: string, newStatus: string, currentStatus: string) => {
        // Do nothing if clicking the already-active status
        if (currentStatus === newStatus) return;

        // Optimistically update UI
        setApplications(prev => prev.map(app =>
            app._id === id ? { ...app, status: newStatus as IApplication['status'] } : app
        ));

        try {
            await axios.put(`/api/vc/pitches/${id}`, { action: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            fetchApplications();
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            wishlist: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
            hold: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            accepted: "bg-mint text-mint-foreground",
        };
        return (
            <Badge className={styles[status as keyof typeof styles] || "bg-gray-100"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-mint-deep";
        if (score >= 60) return "text-blue-600 dark:text-blue-400";
        if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const filteredApplications = applications.filter(app => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            app.founderId.fullName.toLowerCase().includes(query) ||
            app.program.title.toLowerCase().includes(query) ||
            app.pitchId?.title?.toLowerCase().includes(query) ||
            app.registrationData?.startupName?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Pitch Reviews</h1>
                    <p className="text-muted-foreground">
                        Review and manage all pitch submissions across all your investment programs.
                    </p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 shrink-0">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Export applications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExport('all')}>All Applications</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pending')}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('wishlist')}>Wishlisted</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('accepted')}>Accepted</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('hold')}>On Hold</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('rejected')}>Rejected</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by founder, startup, program, or pitch title..."
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
                <TabsList className="w-full justify-start overflow-x-auto">
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
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={app.founderId.profileImage} alt={app.founderId.fullName} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                            {app.founderId.fullName?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base truncate">
                                            {app.registrationData?.startupName || app.founderId.fullName}
                                        </CardTitle>
                                        <CardDescription className="text-xs truncate">
                                            {app.registrationData?.founderName || app.founderId.fullName}
                                        </CardDescription>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {app.program.title}
                                </p>
                            </CardHeader>
                            <CardContent className="flex-1 text-sm bg-muted/20 py-3 mx-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-muted-foreground">AI Score</span>
                                    <div className="flex items-center gap-1">
                                        <span className={`font-bold text-xl ${getScoreColor(app.score)}`}>
                                            {app.score}
                                        </span>
                                        <span className="text-muted-foreground">/100</span>
                                    </div>
                                </div>
                                {app.registrationData && (
                                    <div className="text-xs text-muted-foreground space-y-1 mt-3 pt-3 border-t">
                                        <p><span className="font-medium">Industry:</span> {app.registrationData.industry}</p>
                                        <p><span className="font-medium">Stage:</span> {app.registrationData.stage.replace('_', ' ')}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter
                                className="border-t pt-4 grid grid-cols-4 gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant={app.status === 'wishlist' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`w-full text-xs ${app.status === 'wishlist' ? 'bg-purple-600 hover:bg-purple-700 text-white hover:text-white' : 'bg-transparent text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'wishlist', app.status);
                                    }}
                                >
                                    Wishlist
                                </Button>
                                <Button
                                    variant={app.status === 'accepted' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`w-full text-xs ${app.status === 'accepted' ? 'bg-mint-deep hover:bg-mint-deep/90 text-mint-deep-foreground hover:text-mint-deep-foreground' : 'bg-transparent text-mint-deep border-mint hover:bg-mint/20 hover:text-mint-deep'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'accepted', app.status);
                                    }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant={app.status === 'hold' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`w-full text-xs ${app.status === 'hold' ? 'bg-orange-600 hover:bg-orange-700 text-white hover:text-white' : 'bg-transparent text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'hold', app.status);
                                    }}
                                >
                                    Hold
                                </Button>
                                <Button
                                    variant={app.status === 'rejected' ? 'default' : 'outline'}
                                    size="sm"
                                    className={`w-full text-xs ${app.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white hover:text-white' : 'bg-transparent text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateStatus(app._id, 'rejected', app.status);
                                    }}
                                >
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
