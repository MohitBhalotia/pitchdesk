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
    Bot,
    Star,
    Mail,
    Phone,
    Building2,
    TrendingUp,
    Users as UsersIcon,
    Calendar,
    ExternalLink
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
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function VCPitchDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [application, setApplication] = useState<any>(null);
    const [pitch, setPitch] = useState<any>(null);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/vc/pitches/${id}/details`);
            setApplication(res.data.application);
            setPitch(res.data.pitch);
            setEvaluation(res.data.evaluation);
        } catch (error) {
            console.error("Error fetching pitch details:", error);
        } finally {
            setIsLoading(false);
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
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                <Image src={application.founder?.profileImage || "/placeholder-avatar.png"} alt="Founder" fill className="object-cover" />
                            </div>
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
            <div className="flex items-center gap-3 mb-8 p-4 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium mr-2">Actions:</span>
                <Button
                    variant={application.status === 'wishlist' ? 'default' : 'outline'}
                    className={application.status === 'wishlist' ? 'bg-purple-600 hover:bg-purple-700' : 'text-purple-600 border-purple-200 hover:bg-purple-50'}
                    onClick={() => updateStatus('wishlist')}
                >
                    <Star className="mr-2 h-4 w-4" /> Wishlist
                </Button>
                <Button
                    variant={application.status === 'accepted' ? 'default' : 'outline'}
                    className={application.status === 'accepted' ? 'bg-green-600 hover:bg-green-700' : 'text-green-600 border-green-200 hover:bg-green-50'}
                    onClick={() => updateStatus('accepted')}
                >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                </Button>
                <Button
                    variant={application.status === 'hold' ? 'default' : 'outline'}
                    className={application.status === 'hold' ? 'bg-orange-600 hover:bg-orange-700' : 'text-orange-600 border-orange-200 hover:bg-orange-50'}
                    onClick={() => updateStatus('hold')}
                >
                    <Clock className="mr-2 h-4 w-4" /> Hold
                </Button>
                <Button
                    variant={application.status === 'rejected' ? 'default' : 'outline'}
                    className={application.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'text-red-600 border-red-200 hover:bg-red-50'}
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

                                        <div>
                                            <p className="text-sm font-medium mb-2">Motivation</p>
                                            <p className="text-sm text-muted-foreground">
                                                {application.registrationData.motivation}
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

                                    <TabsContent value="pitch" className="space-y-4 mt-4">
                                        <div>
                                            <p className="text-sm font-medium mb-2">Pitch Title</p>
                                            <p className="text-sm text-muted-foreground">{pitch?.title || 'N/A'}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {pitch?.startTime ? new Date(pitch.startTime).toLocaleDateString() : 'N/A'}
                                            </span>
                                            {pitch?.duration && (
                                                <span>
                                                    Duration: {Math.floor(pitch.duration / 60)}m {pitch.duration % 60}s
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium mb-2">AI Feedback</p>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                {application.botFeedback || 'No feedback available'}
                                            </p>
                                        </div>
                                        {pitch?._id && (
                                            <Button onClick={() => router.push(`/evaluation/${pitch._id}`)}>
                                                View Full Evaluation
                                            </Button>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary */}
                    {evaluation?.summary && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="h-5 w-5" /> Executive Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                        {evaluation.summary}
                                    </p>
                                </div>
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
                                        pitch.conversationHistory.map((msg: any, i: number) => (
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
                                <div className="h-12 w-12 relative bg-muted rounded-full overflow-hidden">
                                    <Image src={application.founder?.profileImage || "/placeholder-avatar.png"} alt="Profile" fill className="object-cover" />
                                </div>
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
