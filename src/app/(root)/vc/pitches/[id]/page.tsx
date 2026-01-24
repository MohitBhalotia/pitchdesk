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
    Play,
    BarChart3,
    MessageSquare,
    Bot,
    Send
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function VCPitchDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const [application, setApplication] = useState<any>(null);
    const [pitch, setPitch] = useState<any>(null);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);

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
            fetchData(); // Refresh to get updated status and messages
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        try {
            setIsSending(true);
            await axios.put(`/api/vc/pitches/${id}`, { message: messageText });
            setMessageText("");
            toast.success("Message sent!");
            fetchData(); // Refresh to get new messages
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) return <div className="p-10 flex justifying-center">Loading...</div>;
    if (!application) return <div className="p-10">Application not found</div>;

    const scoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 50) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reviews
            </Button>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Header Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant={application.status === 'pending' ? "outline" : "secondary"} className="capitalize">
                            {application.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Submitted {new Date(application.submittedAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{pitch?.title || "Untitled Pitch"}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                <Image src={application.founder?.profileImage || "/placeholder-avatar.png"} alt="Founder" fill className="object-cover" />
                            </div>
                            <span className="font-medium">{application.founder?.fullName}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-muted-foreground">{application.program?.title}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus('wishlist')}>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => updateStatus('hold')}>
                        <Clock className="mr-2 h-4 w-4" /> Hold
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus('rejected')}>
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    {/* Score Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" /> AI Evaluation Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`text-5xl font-extrabold ${evaluation?.scores?.TotalScore > 80 ? "text-green-600" :
                                    evaluation?.scores?.TotalScore > 50 ? "text-yellow-600" : "text-red-600"
                                    }`}>
                                    {evaluation?.scores?.TotalScore || 0}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Progress value={evaluation?.scores?.TotalScore || 0} className="h-4" indicatorClassName={scoreColor(evaluation?.scores?.TotalScore || 0)} />
                                    <p className="text-sm text-muted-foreground">Confidence Score: {evaluation?.scores?.BusinessInvestabilityConfidence || 0}%</p>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {evaluation?.scores && Object.entries(evaluation.scores).map(([key, value]: any) => {
                                    if (typeof value === 'object' && value.Subtotal !== undefined) {
                                        return (
                                            <div key={key} className="p-3 bg-muted/30 rounded-lg">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    <span className="font-bold">{value.Subtotal}/10</span>
                                                </div>
                                                <Progress value={value.Subtotal * 10} className="h-2" />
                                            </div>
                                        )
                                    }
                                    return null;
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary & Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="h-5 w-5" /> Executive Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {evaluation?.summary || "No summary available."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transcript */}
                    <Tabs defaultValue="transcript">
                        <TabsList>
                            <TabsTrigger value="transcript"><FileText className="h-4 w-4 mr-2" /> Transcript</TabsTrigger>
                            <TabsTrigger value="recording"><Play className="h-4 w-4 mr-2" /> Recording</TabsTrigger>
                            <TabsTrigger value="messages"><MessageSquare className="h-4 w-4 mr-2" /> Messages</TabsTrigger>
                        </TabsList>
                        <TabsContent value="transcript">
                            <Card>
                                <ScrollArea className="h-[400px] p-4">
                                    <div className="space-y-4">
                                        {pitch?.conversationHistory?.map((msg: any, i: number) => (
                                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    {msg.role === 'user' ? 'U' : 'AI'}
                                                </div>
                                                <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>
                        </TabsContent>
                        <TabsContent value="recording">
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    Audio recording feature coming soon.
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="messages">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Communication with Founder</CardTitle>
                                    <CardDescription>
                                        {application.status === 'accepted'
                                            ? 'Exchange messages with the founder about next steps.'
                                            : 'Accept this application to enable messaging.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[300px] mb-4">
                                        <div className="space-y-3">
                                            {application.messages?.length > 0 ? (
                                                application.messages.map((msg: any, idx: number) => (
                                                    <div key={idx} className={`flex gap-3 ${msg.from === 'vc' ? 'flex-row-reverse' : ''}`}>
                                                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${msg.from === 'vc' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                            }`}>
                                                            {msg.from === 'vc' ? 'VC' : 'F'}
                                                        </div>
                                                        <div className={`flex-1 max-w-[80%]`}>
                                                            <div className={`p-3 rounded-lg ${msg.from === 'vc' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                                }`}>
                                                                <p className="text-sm">{msg.message}</p>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1 px-1">
                                                                {new Date(msg.timestamp).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground text-sm">
                                                    No messages yet
                                                </div>
                                            )}
                                        </div>
                                    </ScrollArea>

                                    {application.status === 'accepted' && (
                                        <div className="flex gap-2 pt-4 border-t">
                                            <Textarea
                                                placeholder="Type your message..."
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                                className="min-h-[80px]"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        sendMessage();
                                                    }
                                                }}
                                            />
                                            <Button
                                                onClick={sendMessage}
                                                disabled={isSending || !messageText.trim()}
                                                className="self-end"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Founder Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 relative bg-muted rounded-full overflow-hidden">
                                    <Image src={application.founder?.profileImage || "/placeholder-avatar.png"} alt="Profile" fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-medium">{application.founder?.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{application.founder?.email}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium mb-1">Previous Pitches</p>
                                <p className="text-xs text-muted-foreground">{application.founder?.pitchesCount || 0} sessions captured</p>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Add Notes or Internal Comments here if needed */}
                </div>
            </div>
        </div>
    );
}
