"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, User, FileText, Calendar, TrendingUp, Mail, Phone, Building2, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { toast } from "sonner";

interface IApplication {
    _id: string;
    founderId: {
        fullName: string;
        email: string;
        profileImage: string;
    };
    pitchId: {
        _id: string;
        title: string;
        startTime: string;
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
        motivation: string;
    };
    status: string;
    score: number;
    botFeedback: string;
    submittedAt: string;
}

export default function ApplicationsPage() {
    const router = useRouter();
    const { id } = useParams();
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        if (id) {
            fetchApplications();
        }
    }, [id]);

    const fetchApplications = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/vc/incubations/${id}/applications`);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to fetch applications");
        } finally {
            setIsLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
        try {
            await axios.patch(`/api/vc/incubations/${id}/applications`, {
                applicationId,
                status: newStatus,
            });
            toast.success("Status updated successfully");
            fetchApplications();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "wishlist":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "accepted":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            case "rejected":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            case "hold":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-blue-600 dark:text-blue-400";
        if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const filteredApplications = applications.filter((app) =>
        filterStatus === "all" ? true : app.status === filterStatus
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => router.push(`/vc/incubations/${id}`)}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Program
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                <p className="text-muted-foreground mt-1">
                    Review and manage applications for this incubation program
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{applications.length}</div>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-600">
                            {applications.filter((a) => a.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-600">
                            {applications.filter((a) => a.status === "wishlist").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Wishlist</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-600">
                            {applications.filter((a) => a.status === "accepted").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Accepted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-600">
                            {applications.filter((a) => a.status === "rejected").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm font-medium">Filter by status:</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="wishlist">Wishlist</SelectItem>
                        <SelectItem value="hold">Hold</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                            <p className="text-muted-foreground">
                                {filterStatus === "all"
                                    ? "No applications have been submitted yet"
                                    : `No ${filterStatus} applications`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map((application) => (
                        <Card key={application._id} className="overflow-hidden">
                            <CardHeader className="bg-muted/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden border-2">
                                            <Image
                                                src={application.founderId.profileImage || "/placeholder-avatar.png"}
                                                alt={application.founderId.fullName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                {application.registrationData.startupName}
                                            </CardTitle>
                                            <CardDescription>
                                                by {application.registrationData.founderName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${getScoreColor(application.score)}`}>
                                                {application.score}
                                            </div>
                                            <p className="text-xs text-muted-foreground">AI Score</p>
                                        </div>
                                        <Badge className={getStatusColor(application.status)}>
                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList>
                                        <TabsTrigger value="details">Details</TabsTrigger>
                                        <TabsTrigger value="pitch">Pitch</TabsTrigger>
                                        <TabsTrigger value="actions">Actions</TabsTrigger>
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
                                                            Visit Website
                                                        </a>
                                                    </Button>
                                                )}
                                                {application.registrationData.linkedin && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={application.registrationData.linkedin} target="_blank" rel="noopener noreferrer">
                                                            LinkedIn Profile
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="pitch" className="space-y-4 mt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium mb-2">Pitch Title</p>
                                                <p className="text-sm text-muted-foreground">{application.pitchId.title}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(application.pitchId.startTime).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    Duration: {Math.floor(application.pitchId.duration / 60)}m {application.pitchId.duration % 60}s
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium mb-2">AI Feedback</p>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {application.botFeedback}
                                                </p>
                                            </div>
                                            <Button onClick={() => router.push(`/evaluation/${application.pitchId._id}`)}>
                                                View Full Evaluation
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="actions" className="space-y-4 mt-4">
                                        <div>
                                            <p className="text-sm font-medium mb-3">Change Application Status</p>
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={application.status === "wishlist" ? "default" : "outline"}
                                                    size="sm"
                                                    className={application.status === "wishlist" ? "bg-purple-600 hover:bg-purple-700 text-white" : "text-purple-600 border-purple-300 hover:bg-purple-50"}
                                                    onClick={() => updateApplicationStatus(application._id, "wishlist")}
                                                >
                                                    Wishlist
                                                </Button>
                                                <Button
                                                    variant={application.status === "hold" ? "default" : "outline"}
                                                    size="sm"
                                                    className={application.status === "hold" ? "bg-orange-600 hover:bg-orange-700 text-white" : "text-orange-600 border-orange-300 hover:bg-orange-50"}
                                                    onClick={() => updateApplicationStatus(application._id, "hold")}
                                                >
                                                    Hold
                                                </Button>
                                                <Button
                                                    variant={application.status === "accepted" ? "default" : "outline"}
                                                    size="sm"
                                                    className={application.status === "accepted" ? "bg-green-600 hover:bg-green-700 text-white" : "text-green-600 border-green-300 hover:bg-green-50"}
                                                    onClick={() => updateApplicationStatus(application._id, "accepted")}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant={application.status === "rejected" ? "default" : "outline"}
                                                    size="sm"
                                                    className={application.status === "rejected" ? "bg-red-600 hover:bg-red-700 text-white" : "text-red-600 border-red-300 hover:bg-red-50"}
                                                    onClick={() => updateApplicationStatus(application._id, "rejected")}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium mb-2">Submitted</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(application.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
