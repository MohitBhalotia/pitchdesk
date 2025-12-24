"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  Trophy,
  Clock,
  User,
  MapPin,
  Award,
  BarChart3,
  CheckCircle2Icon,
  ExternalLink,
} from "lucide-react";
import RegistrationForm from "./registration-form";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface Competition {
  _id: string;
  title: string;
  description: string;
  vcId: string;
  collegeName: string;
  collegeLogo: string;
  bannerImage1: string;
  bannerImage2: string;
  prizePool: string;
  postedDate: string;
  registrationDeadline: string;

  teamSize: {
    min: number;
    max: number;
  };
  stages: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  details: {
    description: string;
    eligibility: string;
    rules: string[];
    rewards: string[];
  };
  contacts: Array<{
    name: string;
    email: string;
    phone?: string;
    role: string;
  }>;
  eventInterval?: {
    start: string;
    end: string;
  };
  totalRegistered: number;
  pitchTime: number;
  isPractice: boolean;
}

// Update the participant type
type TeamMember = {
  name: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  userId?: string;
};

interface Participant {
  _id: string;
  teamName: string;
  teamLeader: {
    email: string;
    name: string;
  };
  teamMembers: TeamMember[];
  teamStatus: "disqualified" | "validated" | "incomplete";
  // status: 'registered' | 'submitted' | 'disqualified';
  pitchSubmitted: boolean;
  pitchEvaluated: boolean;
}

export default function CompetitionPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Check if params.id exists
        if (!params?.id) {
          setError("Competition ID not found");
          return;
        }

        // Fetch competition data
        const compResponse = await axios.get(
          `/api/competitions?id=${params.id}`
        );
        setCompetition(compResponse.data);

        // Check if user is registered (only if user is authenticated)
        if (session?.user?._id) {
          try {
            const partResponse = await axios.get(
              `/api/competitions/participants?competitionId=${params.id}&userId=${session.user._id}`
            );
            console.log("participant data from main page", partResponse.data);
            // Check if participant data exists
            if (partResponse.data) {
              setParticipant(partResponse.data);
            }
          } catch (error) {
            // User is not registered, which is fine - explicitly set to null
            setParticipant(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load competition details");
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if session is loaded (not loading) and we have params
    if (status !== "loading" && params?.id) {
      fetchData();
    }
  }, [params?.id, session?.user?._id, status]);

  const handleRegistrationSuccess = (participantData: Participant) => {
    setParticipant(participantData);
    setShowRegistration(false);

    // Refresh competition data to update total registered count
    if (params?.id) {
      axios
        .get(`/api/competitions?id=${params.id}`)
        .then((response) => setCompetition(response.data))
        .catch(console.error);
    }
  };

  const handleStartPitchButton = () => {
    if (!competition?.vcId) {
      console.error("VC ID not found");
      return;
    }
    window.open(
      `/start-pitch?agentId=${competition.vcId}&competitionId=${competition._id}${competition.isPractice ? "&practice=true" : ""}`,
      "_blank"
    );
  };

  const handleLeaderboardButton = () => {
    if (!params?.id) {
      console.error("Competition ID not found");
      return;
    }
    router.push(`/competitions/${params.id}/leaderboard`);
  };

  const handlePitchEvaluationButton = () => {
    if (!params?.id) {
      console.error("Competition ID not found");
      return;
    }
    router.push(`/competitions/${params.id}/evaluation`);
  };

  if (loading) {
    return <CompetitionPageSkeleton />;
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {error ? "Error Loading Competition" : "Competition Not Found"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || "The competition you are looking for does not exist."}
              </p>
              <Button asChild>
                <Link href="/competitions">Back to Competitions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysLeft = calculateDaysLeft(competition.registrationDeadline);
  const isRegistrationOpen = daysLeft > 0;
  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Banner Image with Overlay */}
        <div className="relative aspect-video sm:aspect-[21/9] rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-lg">
          <Image
            src={competition.bannerImage2}
            alt={competition.title}
            width={1000}
            height={1000}
            className="object-fit w-full h-full border-3 border-white/30 rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 line-clamp-2">
              {competition.title}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base truncate">
                  {competition.collegeName}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-none text-xs sm:text-sm w-fit"
              >
                <Trophy className="w-3 h-3 mr-1" />
                {competition.prizePool}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* College Info */}
            <Card>
              <CardContent>
                <div className="flex items-center gap-3 sm:gap-4">
                  <Image
                    src={competition.collegeLogo}
                    alt={competition.collegeName}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover border flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold truncate">
                      {competition.collegeName}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Posted on{" "}
                      {new Date(competition.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="stages" className="w-full">
              <TabsList className="w-full h-auto sm:h-12  flex md:grid md:grid-cols-5 gap-1 p-1 px-2">
                <TabsTrigger
                  value="stages"
                  className="text-sm flex-shrink-0 px-2 sm:px-4"
                >
                  Stages
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="text-sm flex-shrink-0 px-2 sm:px-4"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="dates"
                  className="text-sm flex-shrink-0 px-2 sm:px-4"
                >
                  Dates
                </TabsTrigger>
                <TabsTrigger
                  value="prizes"
                  className="text-sm flex-shrink-0 px-2 sm:px-4"
                >
                  Prizes
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="text-sm flex-shrink-0 px-2 sm:px-4"
                >
                  Contacts
                </TabsTrigger>
              </TabsList>

              {/* Stages & Timeline Tab */}
              <TabsContent
                value="stages"
                className="space-y-3 sm:space-y-4 mt-4"
              >
                {competition.stages.map((stage, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg">
                            {stage.name}
                          </CardTitle>
                          <CardDescription className="mt-2 text-xs sm:text-sm">
                            {stage.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="w-fit text-xs">
                          {getStageStatus(stage.startDate, stage.endDate)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">
                            Start:{" "}
                            {new Date(stage.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">
                            End: {new Date(stage.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {competition.details.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {competition.details.eligibility}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rules & Guidelines for online round</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {competition.details.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dates & Deadlines Tab */}
              <TabsContent value="dates" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Important Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Registration Deadline</span>
                      </div>
                      <Badge
                        className=" text-xs "
                        variant={isRegistrationOpen ? "default" : "destructive"}
                      >
                        {new Date(
                          competition.registrationDeadline
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Badge>
                    </div>

                    {competition.stages.map((stage, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div className="flex flex-1 flex-col gap-1">
                          <p className="font-medium">{stage.name}</p>
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <p className="text-sm flex-1 text-muted-foreground">
                              {stage.description}
                            </p>
                            <div className="w-full sm:w-fit flex flex-row sm:flex-col justify-between items-end gap-2">
                              <p className="text-sm">
                                {new Date(stage.startDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}{" "}
                                -{" "}
                                {new Date(stage.endDate).toLocaleDateString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              <Badge
                                variant="outline"
                                className={` ${getStageStatus(stage.startDate, stage.endDate) === "Active" ? "bg-green-500 text-white" : getStageStatus(stage.startDate, stage.endDate) === "Completed" ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}`}
                              >
                                {getStageStatus(stage.startDate, stage.endDate)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prizes Tab */}
              <TabsContent value="prizes">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Prize Pool</h3>
                      <p className="text-4xl font-bold text-primary mb-4">
                        {competition.prizePool}
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {competition.details.rewards.map((reward, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg w-full"
                        >
                          <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <div className="w-full flex flex-row items-center gap-2 justify-between">
                            <span className="font-semibold text-base ">
                              {reward.split(":")[0]}{" "}
                            </span>
                            <span className="font-bold text-accent-foreground text-xl">
                              {reward.split(":")[1]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contacts Tab */}
              <TabsContent value="contacts">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                      Event Contacts
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Get in touch with the event organizers for any queries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {competition.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base truncate">
                              {contact.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {contact.role}
                            </p>
                            {contact.phone && (
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {contact.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 sm:flex-none text-xs sm:text-sm"
                          >
                            <a href={`mailto:${contact.email}`}>
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Email
                            </a>
                          </Button>
                          {contact.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-1 sm:flex-none text-xs sm:text-sm"
                            >
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Call
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CompetitionSidebar
              competition={competition}
              participant={participant}
              isAuthenticated={isAuthenticated}
              isRegistrationOpen={isRegistrationOpen}
              onShowRegistration={() => setShowRegistration(true)}
              onStartPitch={handleStartPitchButton}
              onLeaderboard={handleLeaderboardButton}
              onPitchEvaluation={handlePitchEvaluationButton}
            />
          </div>
        </div>

        {/* Registration Form Modal */}
        {showRegistration && (
          <RegistrationForm
            competition={competition}
            onClose={() => setShowRegistration(false)}
            onSuccess={handleRegistrationSuccess}
            userData={{
              id: session?.user?._id || "",
              name: session?.user?.fullName || "",
              email: session?.user?.email || "",
            }}
          />
        )}
      </div>
    </div>
  );
}

// Sidebar Component
function CompetitionSidebar({
  competition,
  participant,
  isAuthenticated,
  isRegistrationOpen,
  onShowRegistration,
  onStartPitch,
  onLeaderboard,
  onPitchEvaluation,
}: {
  competition: Competition;
  participant: Participant | null;
  isAuthenticated: boolean;
  isRegistrationOpen: boolean;
  onShowRegistration: () => void;
  onStartPitch: () => void;
  onLeaderboard: () => void;
  onPitchEvaluation: () => void;
}) {
  const daysLeft = calculateDaysLeft(competition.registrationDeadline);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const router = useRouter();
  let isLeader = false;
  let isTeamMember = false;
  let userMember: TeamMember | undefined;
  if (participant && userEmail) {
    if (participant.teamLeader.email === userEmail) {
      isLeader = true;
    } else {
      userMember = participant.teamMembers.find((m) => m.email === userEmail);
      isTeamMember = !!userMember;
    }
  }
  const isValidated = participant?.teamStatus === "validated";

  // ---- Add member modal logic ----
  const [addModal, setAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addEmailError, setAddEmailError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState<string | null>(null); // email of member being resent
  const [removeLoading, setRemoveLoading] = useState<string | null>(null); // email of member being removed

  // Email validation utility (copied from registration-form.tsx)
  function validateTeamMemberEmails(
    members: { email: string }[],
    teamLeaderEmail: string
  ) {
    const errors: string[] = [];
    const seen = new Set<string>();
    const leaderEmailLower = teamLeaderEmail.trim().toLowerCase();
    members.forEach((member, idx) => {
      const email = member.email.trim();
      const emailLower = email.toLowerCase();
      if (!email) {
        errors[idx] = "Email is required";
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors[idx] = "Invalid email format";
        return;
      }
      if (emailLower === leaderEmailLower) {
        errors[idx] = "Cannot invite yourself";
        return;
      }
      if (seen.has(emailLower)) {
        errors[idx] = "Duplicate email";
        return;
      }
      seen.add(emailLower);
      errors[idx] = "";
    });
    return errors;
  }

  // Local state for participant update (for optimistic update when adding member)
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(
    participant
  );

  // Compute (leader + accepted + pending)
  const teamCount =
    1 +
    (localParticipant?.teamMembers.filter(
      (m) => m.status === "pending" || m.status === "accepted"
    ).length || 0);
  const maxTeam = competition.teamSize.max;
  // If leader AND team not full (ignoring declined), let them add
  const canAddMore = isLeader && teamCount < maxTeam;

  // Used to update local UI instead of window.location.reload
  const reFetchParticipant = useCallback(async () => {
    if (!localParticipant) return;
    try {
      const res = await axios.get(
        `/api/competitions/participants?competitionId=${competition._id}&userId=${session?.user?._id}`
      );
      console.log("data from sidebar", res.data);
      if (res.data) setLocalParticipant(res.data);
    } catch (err) {
      /* do nothing, UI tolerant */
    }
  }, [competition._id, localParticipant]);

  // When prop participant changes (after registration), sync local state
  useEffect(() => {
    setLocalParticipant(participant);
  }, [participant]);

  // Resend invite action
  async function handleResendInvite(memberEmail: string) {
    if (!localParticipant?._id) return;
    setResendLoading(memberEmail);
    try {
      const response = await axios.patch(
        "/api/competitions/participants",
        {
          participantId: localParticipant._id,
          memberEmail: memberEmail,
        },
        { validateStatus: () => true }
      );
      if (response.status === 200 || response.data?.success) {
        toast.success("Invitation resent successfully!");
        if (response.data?.participant) {
          setLocalParticipant(response.data.participant);
        } else {
          await reFetchParticipant();
        }
      } else {
        toast.error(response.data?.error || "Could not resend invitation.");
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.error || "Network error.");
    } finally {
      setResendLoading(null);
    }
  }

  // Remove pending member action
  async function handleRemoveMember(memberEmail: string) {
    if (!localParticipant?._id) return;
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }
    setRemoveLoading(memberEmail);
    try {
      const response = await axios.delete(
        "/api/competitions/participants",
        {
          data: {
            participantId: localParticipant._id,
            memberEmail: memberEmail,
          },
          validateStatus: () => true
        }
      );
      if (response.status === 200 || response.data?.success) {
        toast.success("Member removed successfully!");
        if (response.data?.participant) {
          setLocalParticipant(response.data.participant);
        } else {
          await reFetchParticipant();
        }
      } else {
        toast.error(response.data?.error || "Could not remove member.");
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.error || "Network error.");
    } finally {
      setRemoveLoading(null);
    }
  }

  // Add member action (add is handled fully in state, not hard refresh)
  async function handleAddMember() {
    // Validation
    const trimmedEmail = newMemberEmail.trim();
    const emailsToCheck = [
      ...(localParticipant?.teamMembers || []).map((m) => ({ email: m.email })),
      { email: trimmedEmail },
    ];
    const errors = validateTeamMemberEmails(
      emailsToCheck,
      localParticipant?.teamLeader?.email || ""
    );
    const thisError = errors[errors.length - 1];
    setAddEmailError(thisError || null);
    if (thisError) return;

    setAddLoading(true);
    try {
      const response = await axios.put(
        "/api/competitions/participants",
        {
          participantId: localParticipant?._id,
          name: newMemberName,
          email: trimmedEmail,
        },
        { validateStatus: () => true }
      );
      if (response.status === 200 || response.data?.success) {
        toast.success("Invitation sent!");
        setAddModal(false);
        setNewMemberName("");
        setNewMemberEmail("");
        setAddEmailError(null);
        // Use returned participant; or re-fetch if not present
        if (response.data?.participant) {
          setLocalParticipant(response.data.participant);
        } else {
          await reFetchParticipant();
        }
      } else {
        toast.error(response.data?.error || "Could not invite member.");
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error(e?.response?.data?.error || "Network error.");
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle className="text-lg sm:text-xl flex items-center gap-2 mt-2">
          <CheckCircle2Icon className="w-6 h-6 " />
          Mini Practice Plan for{" "}
          <p className="flex gap-2">
            <span className="line-through text-muted-foreground">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(140)}
            </span>
            <span>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(70)}
            </span>
          </p>
        </AlertTitle>

        <AlertDescription className="p-2 py-4">
          <ul className="list-disc list-inside ">
            <li>Boost your preparation with our Mini Practice Plan.</li>
            <li>Start practicing now and improve your performance!</li>
          </ul>
          <Button
            onClick={() => router.push("/payment")}
            className="mt-4 w-full"
          >
            View Plan
          </Button>
        </AlertDescription>
      </Alert>

      <Card className="lg:sticky lg:top-6">
        <CardHeader className="border-b ">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Competition Info
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 p-4 sm:p-6">
          {!participant ? (
            // Not registered
            <>
              {!isAuthenticated ? (
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2">
                      Sign In to Register
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                      Please sign in to register for this competition
                    </p>
                  </div>
                  <Button
                    asChild
                    className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <Button
                      onClick={onShowRegistration}
                      disabled={!isRegistrationOpen}
                      className="w-full h-10 sm:h-12 text-sm sm:text-base lg:text-lg"
                      size="lg"
                    >
                      {isRegistrationOpen
                        ? "Register Now"
                        : "Registration Closed"}
                    </Button>
                    {!isRegistrationOpen && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        Registration deadline has passed
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                      <span className="flex items-center gap-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        Registered Teams:
                      </span>
                      <span className="font-semibold">
                        {competition.totalRegistered}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                      <span className="flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Team Size:
                      </span>
                      <span className="font-semibold">
                        {competition.teamSize.min}-{competition.teamSize.max}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        Deadline:
                      </span>
                      <span className="font-semibold whitespace-nowrap">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            // Registered (both leader and members see this team info)
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-background rounded-lg border border-primary/20">
                <div className="flex flex-row items-center justify-between py-2">
                  <h4 className="font-semibold text-xl flex justify-center items-center gap-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 " /> Your Team
                  </h4>
                  <div className="">
                    <Badge
                      variant={
                        (localParticipant || participant).teamStatus ===
                        "validated"
                          ? "outline"
                          : (localParticipant || participant).teamStatus ===
                              "incomplete"
                            ? "destructive"
                            : "outline"
                      }
                      className={`text-xs ${(localParticipant || participant).teamStatus === "validated" ? "bg-green-100 text-green-800" : (localParticipant || participant).teamStatus === "incomplete" ? "bg-destructive text-white" : ""}`}
                    >
                      {(localParticipant || participant).teamStatus ===
                      "validated"
                        ? "Team Ready"
                        : (localParticipant || participant).teamStatus ===
                            "incomplete"
                          ? "Team incomplete"
                          : "Team Disqualified"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                    <p className="font-semibold text-primary break-words text-lg w-full text-center">
                      {localParticipant?.teamName || participant.teamName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-between py-2">
                    <div>
                      <p className="break-words">
                        {(localParticipant || participant).teamLeader.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        ({(localParticipant || participant).teamLeader.email})
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs bg-amber-500 text-black"
                    >
                      Team Leader
                    </Badge>
                  </div>
                  {(localParticipant || participant).teamMembers.length > 0 && (
                    <div className="space-y-1 py-2">
                      <strong className="block mb-1">Team Members:</strong>
                      <ul className="space-y-1 max-h-32 sm:max-h-48 overflow-y-auto pr-1">
                        {(localParticipant || participant).teamMembers.map(
                          (member, index) => (
                            <li
                              key={index}
                              className={`flex items-center gap-4 ${member.status === "accepted" ? "bg-green-400/50" : member.status === "declined" ? "bg-red-400/50" : "bg-yellow-300/50"} rounded-lg p-2`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${member.status === "accepted" ? "bg-green-500" : member.status === "declined" ? "bg-red-500" : "bg-yellow-500"} mt-1 flex-shrink-0`}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="break-words">{member.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  ({member.email})
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  {member.status === "pending"
                                    ? "Pending"
                                    : member.status === "accepted"
                                      ? "Accepted"
                                      : "Declined"}
                                </Badge>
                                {isLeader && member.status === "pending" && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => handleResendInvite(member.email)}
                                      disabled={resendLoading === member.email || removeLoading !== null}
                                    >
                                      {resendLoading === member.email ? "..." : "Resend"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => handleRemoveMember(member.email)}
                                      disabled={removeLoading === member.email || resendLoading !== null}
                                    >
                                      {removeLoading === member.email ? "..." : "Remove"}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions - only if teamLeader */}
              {isLeader && (
                <div className="space-y-2 sm:space-y-3">
                  {/* Leaderboard button - enabled only if team is validated */}
                  {/* Event interval logic for Leaderboard */}
                  {(() => {
                    const now = new Date();
                    const eventStart = competition.eventInterval?.start
                      ? new Date(competition.eventInterval.start)
                      : null;
                    const eventEnd = competition.eventInterval?.end
                      ? new Date(competition.eventInterval.end)
                      : null;
                    const pitchGiven = (localParticipant || participant)
                      ?.pitchSubmitted;
                    if (eventStart && eventEnd) {
                      if (now < eventStart) {
                        return (
                          <Button className="w-full" size="lg" disabled>
                            <Trophy className="w-4 h-4 mr-2" />
                            <div className="flex sm:flex-row flex-col items-center sm:gap-2">
                              <span>Go to Leaderboard</span>
                              <span className="text-xs">
                                (Available on event day)
                              </span>
                            </div>
                          </Button>
                        );
                      }
                      if (now > eventEnd && !pitchGiven) {
                        return (
                          <Button className="w-full" size="lg" disabled>
                            <Trophy className="w-4 h-4 mr-2" />
                            <div className="flex sm:flex-row flex-col items-center sm:gap-2">
                              <span>Go to Leaderboard</span>
                              <span className="text-xs">
                                (Event window closed)
                              </span>
                            </div>
                          </Button>
                        );
                      }
                    }
                    return (
                      <Button
                        onClick={onLeaderboard}
                        className="w-full"
                        size="lg"
                        disabled={!isValidated}
                      >
                        <Trophy className="w-4 h-4 mr-2" /> Go to Leaderboard
                      </Button>
                    );
                  })()}

                  {/* Conditional buttons based on pitch submission and evaluation status */}
                  {/* Start Pitch - shown if pitch not submitted OR if it's a practice competition */}
                  {(!(localParticipant || participant)?.pitchSubmitted ||
                    competition.isPractice) &&
                    (() => {
                      const now = new Date();
                      const eventStart = competition.eventInterval?.start
                        ? new Date(competition.eventInterval.start)
                        : null;
                      const eventEnd = competition.eventInterval?.end
                        ? new Date(competition.eventInterval.end)
                        : null;
                      if (eventStart && eventEnd) {
                        if (now < eventStart) {
                          return (
                            <Button
                              className="w-full"
                              size="lg"
                              disabled
                              variant="outline"
                            >
                              <div className="flex sm:flex-row flex-col items-center sm:gap-2">
                                <span>Start Pitch</span>
                                <span className="text-xs">
                                  (Available on event day)
                                </span>
                              </div>
                            </Button>
                          );
                        }
                        if (now > eventEnd) {
                          return (
                            <Button
                              className="w-full"
                              size="lg"
                              disabled
                              variant="outline"
                            >
                              <div className="flex sm:flex-row flex-col items-center sm:gap-2">
                                <span>Start Pitch</span>
                                <span className="text-xs">
                                  (Event window closed)
                                </span>
                              </div>
                            </Button>
                          );
                        }
                      }
                      return (
                        <Button
                          onClick={onStartPitch}
                          variant="outline"
                          className="w-full"
                          size="lg"
                          disabled={!isValidated}
                        >
                          Start Pitch <ExternalLink />
                        </Button>
                      );
                    })()}

                  {/* Evaluate Pitch button - shown if pitch submitted OR if it's a practice competition */}
                  {(localParticipant || participant)?.pitchSubmitted &&
                    (!(localParticipant || participant)?.pitchEvaluated ? (
                      /* Evaluate Pitch - shown if pitch submitted but not evaluated */
                      <>
                        <Button
                          onClick={onPitchEvaluation}
                          className="w-full"
                          size="lg"
                          variant="outline"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Evaluate Pitch
                        </Button>

                        <div className="text-center">
                          <Badge variant="destructive" className="text-xs">
                            ⚠️ Evaluation pending - Complete evaluation to see
                            your rank
                          </Badge>
                        </div>
                      </>
                    ) : (
                      /* Pitch Evaluation - shown if pitch is evaluated */
                      <Button
                        onClick={onPitchEvaluation}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Pitch Evaluation
                      </Button>
                    ))}

                  {/* Invite Another Member - only for leader if team not full */}
                  {localParticipant &&
                    canAddMore &&
                    new Date() < new Date(competition.registrationDeadline) && (
                      <>
                        <Button
                          onClick={() => setAddModal(true)}
                          variant="outline"
                          className="w-full mb-1"
                        >
                          Invite Another Member
                        </Button>
                        {addModal && (
                          <Dialog
                            open={addModal}
                            onOpenChange={(v) => setAddModal(v)}
                          >
                            <DialogContent className="max-w-full">
                              <Card className="bg-background border-none">
                                <CardHeader>
                                  <CardTitle>Add Team Member</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4">
                                  <Input
                                    value={newMemberName}
                                    onChange={(e) =>
                                      setNewMemberName(e.target.value)
                                    }
                                    placeholder="Full Name"
                                    className="h-11"
                                  />
                                  <Input
                                    value={newMemberEmail}
                                    type="email"
                                    onChange={(e) =>
                                      setNewMemberEmail(e.target.value)
                                    }
                                    placeholder="Email Address"
                                    className={`h-11${addEmailError ? " border-destructive" : ""}`}
                                  />
                                  {addEmailError && (
                                    <div className="text-destructive text-xs mt-1">
                                      {addEmailError}
                                    </div>
                                  )}
                                </CardContent>
                                <CardFooter className="justify-between">
                                  <Button
                                    onClick={() => setAddModal(false)}
                                    variant="outline"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    disabled={
                                      addLoading ||
                                      !newMemberName ||
                                      !newMemberEmail
                                    }
                                    onClick={handleAddMember}
                                  >
                                    Send Invite
                                  </Button>
                                </CardFooter>
                              </Card>
                            </DialogContent>
                          </Dialog>
                        )}
                      </>
                    )}
                </div>
              )}

              {/* Team member view: show team info only, no action buttons */}
              {isTeamMember && !isLeader && (
                <div className="text-center py-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You are a team member. Team leader manages actions.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton Loader
function CompetitionPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="aspect-[21/9] rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Utility Functions
function calculateDaysLeft(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getStageStatus(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Active";
  return "Completed";
}
