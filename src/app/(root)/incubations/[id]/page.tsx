"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import {
    Users,
    IndianRupee,
    CheckCircle2,
    Bot,
    ArrowLeft,
    Loader2,
    CalendarCheck,
    AlertCircle,
    FileText,
    Send,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import ApplicationSubmissionDialog from "@/components/incubation/ApplicationSubmissionDialog";

interface IProgram {
    _id: string;
    title: string;
    description: string;
    eligibility: string[];
    rulesAndGuidelines: string[];
    stages: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
    }[];
    fundingAmount: number;
    cohortSize: number;
    timeline: {
        startDate: string;
        endDate: string;
        applicationDeadline: string;
    };
    vcId: {
        fullName: string;
        profileImage: string;
    };
    botId: {
        _id: string;
        name: string;
        image: string;
        description: string;
    } | string;
}

interface IApplication {
    status: string;
}

interface IPitch {
    _id: string;
    title: string;
    startTime: string;
    duration: number;
    creditsUsed: number;
    hasEvaluation?: boolean;
}

export default function IncubationDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const { data: session,status } = useSession();

    const [program, setProgram] = useState<IProgram | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [application, setApplication] = useState<IApplication | null>(null);
    const [pitches, setPitches] = useState<IPitch[]>([]);
    const [isPitchesLoading, setIsPitchesLoading] = useState(false);
    // const [activeTab, setActiveTab] = useState("overview");
    const [selectedPitchId, setSelectedPitchId] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationData, setRegistrationData] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchProgramDetails();
            if (status  !== "loading") {
            checkRegistrationStatus();
            checkApplicationStatus();
            fetchMyPitches();
            }
        }
    }, [id,status]);

    const fetchProgramDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`/api/incubations/${id}`);
            setProgram(response.data);
        } catch (error: any) {
            console.error("Error fetching program:", error);
            setError(error.response?.data?.error || "Failed to load program details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const checkRegistrationStatus = async () => {
        try {
            const response = await axios.get(`/api/incubations/${id}/register`);
            setIsRegistered(response.data.registered);
            setRegistrationData(response.data.participant || null);
        } catch (error) {
            console.error("Error checking registration status:", error);
        }
    };

    const handleRegister = async () => {
        try {
            setIsRegistering(true);
            const response = await axios.post(`/api/incubations/${id}/register`);
            if (response.data.success) {
                setIsRegistered(true);
                setRegistrationData(response.data.participant);
            }
        } catch (error: any) {
            console.error("Error registering:", error);
            alert(error.response?.data?.error || "Failed to register. Please try again.");
        } finally {
            setIsRegistering(false);
        }
    };

    const checkApplicationStatus = async () => {
        try {
            const response = await axios.get(`/api/incubations/${id}/application`);
            setApplication(response.data);
        } catch (error) {
            console.error("Error checking application status", error);
        }
    };

    const fetchMyPitches = async () => {
        try {
            setIsPitchesLoading(true);
            const response = await axios.get(`/api/incubations/${id}/pitches`);
            setPitches(response.data);
        } catch (error) {
            console.error("Error fetching pitches:", error);
        } finally {
            setIsPitchesLoading(false);
        }
    };

    const handleApplicationSuccess = () => {
        checkApplicationStatus();
        fetchMyPitches();
    };

    const openApplicationDialog = (pitchId: string) => {
        setSelectedPitchId(pitchId);
        setIsDialogOpen(true);
    };


    if (isLoading || status === "loading") {
        return <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>;
    }

    if (error) {
        return (
            <div className="container py-20 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Error Loading Program</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={fetchProgramDetails} variant="outline">
                    Retry
                </Button>
            </div>
        );
    }

    if (!program) {
        return <div className="container py-10 text-center">Program not found</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-6xl">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Investment Programs
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                Investment Program
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <CalendarCheck className="h-3 w-3" />
                                Posted {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">
                            {program.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={program.vcId?.profileImage} alt="VC" />
                                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                                        {program.vcId?.fullName?.charAt(0).toUpperCase() || "I"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{program.vcId?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {program.cohortSize ? `${program.cohortSize} Spots` : "Open Cohort"}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
                            <TabsTrigger value="details">Program Details</TabsTrigger>
                            <TabsTrigger value="stages">Stages & Timeline</TabsTrigger>
                            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                            {session && <TabsTrigger value="pitches">My Pitches</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="details" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About the Program</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed whitespace-pre-wrap">{program.description}</p>
                                </CardContent>
                            </Card>
                            {program.fundingAmount && (
                                <Card>
                                    <CardContent className="flex items-center gap-4 py-6">
                                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600">
                                            <IndianRupee className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Funding Available</p>
                                            <p className="text-2xl font-bold">₹{program.fundingAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="stages" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Stages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Array.isArray(program.stages) ? program.stages.map((stage: { title: string; description: string; startDate: string; endDate: string }, i: number) => (
                                            <div key={i} className="border p-4 rounded-lg bg-muted/20">
                                                <h4 className="font-bold mb-1">Stage {i + 1}: {stage.title}</h4>
                                                <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                                                <div className="text-sm text-muted-foreground flex gap-4">
                                                    <span>Start: {new Date(stage.startDate).toLocaleDateString()}</span>
                                                    <span>End: {new Date(stage.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        )) : <p className="whitespace-pre-wrap">{program.stages}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">Application Deadline</span>
                                        <span className="font-medium">{new Date(program.timeline.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">Program Start</span>
                                        <span className="font-medium">{new Date(program.timeline.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Program End</span>
                                        <span className="font-medium">{new Date(program.timeline.endDate).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="eligibility">
                            <Card>
                                <CardContent className="pt-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                            {Array.isArray(program.eligibility) ? program.eligibility.map((item: string, i: number) => (
                                                <li key={i}>{item}</li>
                                            )) : <p>{program.eligibility}</p>}
                                        </ul>
                                    </div>

                                    {program.rulesAndGuidelines && program.rulesAndGuidelines.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Rules & Guidelines</h3>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                {program.rulesAndGuidelines.map((item: string, i: number) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="pitches" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        My Practice Pitches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isPitchesLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : pitches.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">No pitches yet</h3>
                                            {!isRegistered && (
                                                <>
                                                    <p className="text-muted-foreground mb-6">
                                                        Please register for this program first to start pitching.
                                                    </p>
                                                    <Button
                                                        onClick={handleRegister}
                                                        disabled={isRegistering}
                                                        className="gap-2"
                                                    >
                                                        {isRegistering ? "Registering..." : "Register Now"}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pitches.map((pitch) => (
                                                <div
                                                    key={pitch._id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{pitch.title}</h4>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                            <span>
                                                                {new Date(pitch.startTime).toLocaleDateString()} at{' '}
                                                                {new Date(pitch.startTime).toLocaleTimeString()}
                                                            </span>
                                                            {pitch.duration && (
                                                                <span>Duration: {Math.floor(pitch.duration / 60)}m {pitch.duration % 60}s</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!pitch.hasEvaluation ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => router.push(`/evaluation/${pitch._id}`)}
                                                            >
                                                                Evaluate Pitch
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.push(`/evaluation/${pitch._id}`)}
                                                            >
                                                                View Evaluation
                                                            </Button>
                                                        )}
                                                        {!application && isRegistered && !registrationData?.applicationSubmitted && (
                                                            <Button
                                                                size="sm"
                                                                className="gap-2"
                                                                onClick={() => openApplicationDialog(pitch._id)}
                                                                disabled={!pitch.hasEvaluation}
                                                                title={!pitch.hasEvaluation ? "Please evaluate your pitch first" : ""}
                                                            >
                                                                <Send className="h-4 w-4" />
                                                                Submit Application
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar / Actions */}
                <div className="space-y-6">
                    {/* Bot Card */}
                    <Card className="bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Bot className="h-5 w-5 text-indigo-600" />
                                AI Evaluator
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="relative h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <Image src={typeof program.botId === 'object' ? program.botId.image : "/placeholder-avatar.png"} alt="Bot" fill className="object-cover" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{typeof program.botId === 'object' ? program.botId.name : 'AI Judge'}</h3>
                            <p className="text-xs text-muted-foreground mb-4">Official AI Judge</p>
                            <p className="text-sm italic text-muted-foreground">
                                &quot;{typeof program.botId === 'object' ? program.botId.description : "I will be evaluating your pitch based on the criteria set for this program."}&quot;
                            </p>
                        </CardContent>
                    </Card>

                    {/* Application Status Card */}
                    <Card className="shadow-lg border-2 border-primary/10">
                        <CardHeader>
                            <CardTitle>Application</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {application ? (
                                <div className="text-center py-4">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold text-lg">Application Submitted</h3>
                                    <p className="text-muted-foreground text-sm mt-1 mb-4">
                                        Status: <span className="font-medium capitalize text-foreground">{application.status}</span>
                                    </p>
                                    {/* <Button variant="outline" className="w-full" disabled>
                                        View Submission
                                    </Button> */}
                                </div>
                            ) : !isRegistered ? (
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md dark:bg-blue-900/20 dark:text-blue-400">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <p>Register for this program to get 15 minutes of dedicated pitch time!</p>
                                    </div>

                                    <Button
                                        className="w-full size-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                                        onClick={handleRegister}
                                        disabled={isRegistering}
                                    >
                                        {isRegistering ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            "Register Now"
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        One-click registration • No form required
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md dark:bg-green-900/20 dark:text-green-400 mb-4">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        <p>Registered! You have 15 minutes of dedicated pitch time.</p>
                                    </div>

                                    {registrationData?.pitchSubmitted ? (
                                        <div className="text-center py-2">
                                            <p className="text-sm text-muted-foreground mb-4">
                                                You&apos;ve already submitted your pitch for this program. Check the &quot;My Pitches&quot; tab to submit your application.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-start gap-2 text-sm text-black bg-red-300 p-3 rounded-md dark:bg-destructive dark:text-white mb-3">
                                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-semibold">One-Time Opportunity</p>
                                                    <p className="text-xs mt-1">You can only pitch once for this program. Practice first using your dashboard minutes!</p>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                className="w-full mb-3"
                                                onClick={() => router.push('/start-a-pitch')}
                                            >
                                                Practice 
                                            </Button>

                                            <Button
                                                className="w-full size-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                                                onClick={() => window.open(`/start-pitch?agentId=${typeof program.botId === 'object' ? program.botId._id : program.botId}&incubationId=${id}`, "_blank")}
                                            >
                                                Start Pitch
                                            </Button>

                                            <p className="text-xs text-center text-muted-foreground">
                                                After pitching, evaluate it and submit your application
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Application Submission Dialog */}
            {selectedPitchId && (
                <ApplicationSubmissionDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    pitchId={selectedPitchId}
                    programId={id as string}
                    onSuccess={handleApplicationSuccess}
                />
            )}
        </div>
    );
}
