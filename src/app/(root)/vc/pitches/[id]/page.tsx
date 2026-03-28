"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Star,
    Mail,
    Phone,
    Building2,
    TrendingUp,
    Users as UsersIcon,
    Calendar,
    ExternalLink,
    Target,
    Zap,
    Users,
    DollarSign,
    Briefcase,
    Lightbulb,
    Loader2,
    User2,
    AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function VCPitchDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [application, setApplication] = useState<{
        _id: string;
        status: string;
        score: number;
        submittedAt: string;
        founder?: { fullName: string; email: string; profileImage: string };
        program?: { title: string };
        registrationData?: {
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
        botFeedback?: string;
    } | null>(null);
    const [pitch, setPitch] = useState<{
        _id: string;
        title: string;
        startTime: string;
        duration: number;
        conversationHistory?: { role: string; content: string }[];
    } | null>(null);
    const [evaluation, setEvaluation] = useState<{
        summary?: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [overview, setOverview] = useState<PitchOverview | null>(null);
    const [isOverviewLoading, setIsOverviewLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/vc/pitches/${id}/details`);
            const appData = res.data.application;

            // Override stale stored score with the authoritative PitchEval TotalScore
            if (res.data.correctScore != null) {
                appData.score = res.data.correctScore;
            }

            setApplication(appData);
            setPitch(res.data.pitch);
            setEvaluation(res.data.evaluation);
        } catch (error) {
            console.error("Error fetching pitch details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pitch?._id && !overview && !isOverviewLoading) {
            fetchOverview(pitch._id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pitch?._id]);

    const fetchOverview = async (pitchId: string) => {
        if (overview || isOverviewLoading) return;
        try {
            setIsOverviewLoading(true);
            const res = await axios.get(`/api/vc/pitch/${pitchId}/overview`);
            setOverview(res.data.overview);
        } catch (error) {
            console.error("Error fetching overview:", error);
        } finally {
            setIsOverviewLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        try {
            await axios.put(`/api/vc/pitches/${id}`, { action: newStatus });
            toast.success(`Application ${newStatus}!`);
            fetchData(); // Refresh to get updated status
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    if (isLoading) return <div className="p-10 flex justify-center">Loading...</div>;
    if (!application) return <div className="p-10">Application not found</div>;

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
            wishlist: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
            hold: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
            rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        };
        return (
            <Badge className={styles[status as keyof typeof styles] || "bg-gray-100"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-blue-600 dark:text-blue-400";
        if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reviews
            </Button>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Header Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(application.status)}
                        <span className="text-sm text-muted-foreground">
                            Submitted {new Date(application.submittedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">
                        {application.registrationData?.startupName || pitch?.title || "Untitled Pitch"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={application.founder?.profileImage} alt="Founder" />
                                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                    {application.founder?.fullName?.charAt(0).toUpperCase() || "F"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{application.registrationData?.founderName || application.founder?.fullName}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-muted-foreground">{application.program?.title}</span>
                    </div>
                </div>

                {/* AI Score Display */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className={`text-5xl font-extrabold ${getScoreColor(application.score)}`}>
                            {application.score}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">AI Score</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium mr-2">Actions:</span>
                <Button
                    variant={application.status === 'wishlist' ? 'default' : 'outline'}
                    className={application.status === 'wishlist' ? 'bg-purple-600 hover:bg-purple-700 text-white hover:text-white' : 'bg-transparent text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700'}
                    onClick={() => updateStatus('wishlist')}
                >
                    <Star className="mr-2 h-4 w-4" /> Wishlist
                </Button>
                <Button
                    variant={application.status === 'accepted' ? 'default' : 'outline'}
                    className={application.status === 'accepted' ? 'bg-green-600 hover:bg-green-700 text-white hover:text-white' : 'bg-transparent text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700'}
                    onClick={() => updateStatus('accepted')}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Button
                    variant={application.status === 'hold' ? 'default' : 'outline'}
                    className={application.status === 'hold' ? 'bg-orange-600 hover:bg-orange-700 text-white hover:text-white' : 'bg-transparent text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700'}
                    onClick={() => updateStatus('hold')}
                >
                    <Clock className="mr-2 h-4 w-4" /> Hold
                </Button>
                <Button
                    variant={application.status === 'rejected' ? 'default' : 'outline'}
                    className={application.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white hover:text-white' : 'bg-transparent text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700'}
                    onClick={() => updateStatus('rejected')}
                >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Founder Application Details */}
                    {application.registrationData && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" /> Application Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="details">
                                    <TabsList>
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="pitch">Pitch Info</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-4 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-2">
                                                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Email</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {application.registrationData.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Phone</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {application.registrationData.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Industry</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {application.registrationData.industry}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Stage</p>
                                                    <p className="text-sm text-muted-foreground capitalize">
                                                        {application.registrationData.stage.replace("_", " ")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <UsersIcon className="h-4 w-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Team Size</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {application.registrationData.teamSize} members
                                                    </p>
                                                </div>
                                            </div>
                                            {application.registrationData.fundingRaised && (
                                                <div className="flex items-start gap-2">
                                                    <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">Funding Raised</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {application.registrationData.fundingRaised}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium mb-2">Description</p>
                                            <p className="text-sm text-muted-foreground">
                                                {application.registrationData.description}
                                            </p>
                                        </div>



                                        {(application.registrationData.website || application.registrationData.linkedin) && (
                                            <div className="flex gap-4">
                                                {application.registrationData.website && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={application.registrationData.website} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            Visit Website
                                                        </a>
                                                    </Button>
                                                )}
                                                {application.registrationData.linkedin && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={application.registrationData.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            LinkedIn Profile
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="pitch" className="space-y-6 mt-4">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg">
                                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {pitch?.startTime ? new Date(pitch.startTime).toLocaleDateString() : 'N/A'}
                                            </span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                                                <Clock className="h-4 w-4 text-primary" />
                                                Duration: {pitch?.duration ? `${Math.floor(pitch.duration / 60)}m ${pitch.duration % 60}s` : 'N/A'}
                                            </span>
                                        </div>

                                        {/* Overview Component */}
                                        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                                            <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <FileText className="h-4 w-4 text-primary" />
                                                    Pitch Overview
                                                </div>
                                                {pitch?._id && !overview && !isOverviewLoading && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs"
                                                        onClick={() => fetchOverview(pitch._id)}
                                                    >
                                                        Load Overview
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                {isOverviewLoading ? (
                                                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                        <p className="text-sm text-muted-foreground">Analyzing pitch transcript...</p>
                                                    </div>
                                                ) : overview ? (
                                                    <div className="space-y-4">
                                                        <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                                                            <p className="text-sm font-medium text-primary mb-1">One-Liner</p>
                                                            <p className="text-sm italic">{overview.oneLiner || "N/A"}</p>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <Target className="h-3 w-3" /> Problem
                                                                </p>
                                                                <p className="text-sm">{overview.problem || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <Lightbulb className="h-3 w-3" /> Solution
                                                                </p>
                                                                <p className="text-sm">{overview.solution || "N/A"}</p>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <Users className="h-3 w-3" /> Market
                                                                </p>
                                                                <p className="text-sm">{overview.market || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <Zap className="h-3 w-3" /> Key Metrics
                                                                </p>
                                                                <p className="text-sm">{overview.keyMetrics || "N/A"}</p>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <Briefcase className="h-3 w-3" /> Business Model
                                                                </p>
                                                                <p className="text-sm">{overview.businessModel || "N/A"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                    <DollarSign className="h-3 w-3" /> Ask
                                                                </p>
                                                                <p className="text-sm">{overview.ask || "N/A"}</p>
                                                            </div>
                                                        </div>

                                                        {overview.team && (
                                                            <>
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                                                                        <User2 className="h-3 w-3" /> Team
                                                                    </p>
                                                                    <p className="text-sm">{overview.team}</p>
                                                                </div>
                                                                <Separator />
                                                            </>
                                                        )}

                                                        {overview.strengths && overview.strengths.length > 0 && (
                                                            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md border border-green-200 dark:border-green-800/30">
                                                                <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-2 flex items-center gap-1">
                                                                    <CheckCircle2 className="h-3 w-3" /> Strengths
                                                                </p>
                                                                <ul className="space-y-1">
                                                                    {overview.strengths.map((s, i) => (
                                                                        <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                                                                            <span className="text-green-500 mt-0.5">•</span>{s}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {overview.concerns && overview.concerns.length > 0 && (
                                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md border border-amber-200 dark:border-amber-800/30">
                                                                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2 flex items-center gap-1">
                                                                    <AlertTriangle className="h-3 w-3" /> Concerns
                                                                </p>
                                                                <ul className="space-y-1">
                                                                    {overview.concerns.map((c, i) => (
                                                                        <li key={i} className="text-sm text-foreground/90 flex items-start gap-2">
                                                                            <span className="text-amber-500 mt-0.5">•</span>{c}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md border border-yellow-200 dark:border-yellow-800/30">
                                                            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-1">Analyst Take</p>
                                                            <p className="text-sm text-foreground/90">{overview.analystTake || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 text-muted-foreground">
                                                        <p className="text-sm mb-2">Detailed overview not loaded.</p>
                                                        {pitch?._id && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => fetchOverview(pitch._id)}
                                                            >
                                                                Load AI Overview
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {pitch?._id && (
                                            <Button
                                                className="w-full"
                                                onClick={() => router.push(`/evaluation/${pitch._id}`)}
                                            >
                                                View Full Evaluation Report
                                            </Button>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}



                    {/* Transcript */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" /> Conversation Transcript
                            </CardTitle>
                            <CardDescription>Full conversation history from the pitch session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                <div className="space-y-4">
                                    {pitch?.conversationHistory?.length > 0 ? (
                                        pitch.conversationHistory.map((msg: { role: string; content: string }, i: number) => (
                                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    {msg.role === 'user' ? 'U' : 'AI'}
                                                </div>
                                                <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No transcript available
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Founder Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={application.founder?.profileImage} alt="Profile" />
                                    <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                        {application.founder?.fullName?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{application.founder?.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{application.founder?.email}</p>
                                </div>
                            </div>

                            {application.registrationData?.startupName && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium mb-1">Startup</p>
                                        <p className="text-sm text-muted-foreground">{application.registrationData.startupName}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Evaluation Button Card */}
                    {pitch?._id && (
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-base">Full Evaluation</CardTitle>
                                <CardDescription>
                                    View detailed AI analysis and scores
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full"
                                    onClick={() => router.push(`/evaluation/${pitch._id}`)}
                                >
                                    View Full Evaluation
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
