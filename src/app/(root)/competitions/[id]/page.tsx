'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Mail, Phone, Trophy, Clock, User, MapPin, Award, BarChart3 } from 'lucide-react';
import RegistrationForm from './registration-form';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios'
import Link from 'next/link'
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';

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
  totalRegistered: number;
  pitchTime: number;
}

// Update the participant type
type TeamMember = {
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
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
  teamStatus: 'disqualified' | 'validated' | 'incomplete';
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
          setError('Competition ID not found');
          return;
        }

        // Fetch competition data
        const compResponse = await axios.get(`/api/competitions?id=${params.id}`);
        setCompetition(compResponse.data);

        // Check if user is registered (only if user is authenticated)
        if (session?.user?._id) {
          try {
            const partResponse = await axios.get(
              `/api/competitions/participants?competitionId=${params.id}&userId=${session.user._id}`
            );
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
        console.error('Error fetching data:', error);
        setError('Failed to load competition details');
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if session is loaded (not loading) and we have params
    if (status !== 'loading' && params?.id) {
      fetchData();
    }
  }, [params?.id, session?.user?._id, status]);

  const handleRegistrationSuccess = (participantData: Participant) => {
    setParticipant(participantData);
    setShowRegistration(false);

    // Refresh competition data to update total registered count
    if (params?.id) {
      axios.get(`/api/competitions?id=${params.id}`)
        .then(response => setCompetition(response.data))
        .catch(console.error);
    }
  };

  const handleStartPitchButton = () => {
    if (!competition?.vcId) {
      console.error('VC ID not found');
      return;
    }
    router.push(`/start-pitch?agentId=${competition.vcId}`);

  };

  const handleLeaderboardButton = () => {
    if (!params?.id) {
      console.error('Competition ID not found');
      return;
    }
    router.push(`/competitions/${params.id}/leaderboard`);
  };

  const handlePitchEvaluationButton = () => {
    if (!params?.id) {
      console.error('Competition ID not found');
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
                {error ? 'Error Loading Competition' : 'Competition Not Found'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {error || 'The competition you are looking for does not exist.'}
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
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Banner Image with Overlay */}
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8 shadow-lg">
          <img
            src={competition.bannerImage1}
            alt={competition.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{competition.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{competition.collegeName}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
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
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <img
                    src={competition.collegeLogo}
                    alt={competition.collegeName}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{competition.collegeName}</h3>
                    <p className="text-muted-foreground">
                      Posted on {new Date(competition.postedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="stages" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="stages" className="text-sm">Stages & Timeline</TabsTrigger>
                <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                <TabsTrigger value="dates" className="text-sm">Dates & Deadlines</TabsTrigger>
                <TabsTrigger value="prizes" className="text-sm">Prizes</TabsTrigger>
                <TabsTrigger value="contacts" className="text-sm">Contacts</TabsTrigger>
              </TabsList>

              {/* Stages & Timeline Tab */}
              <TabsContent value="stages" className="space-y-4">
                {competition.stages.map((stage, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{stage.name}</CardTitle>
                          <CardDescription className="mt-2">
                            {stage.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          {getStageStatus(stage.startDate, stage.endDate)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Start: {new Date(stage.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          End: {new Date(stage.endDate).toLocaleDateString()}
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
                    <CardTitle>Rules & Guidelines</CardTitle>
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
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Registration Deadline</span>
                      </div>
                      <Badge variant={isRegistrationOpen ? 'default' : 'destructive'}>
                        {new Date(competition.registrationDeadline).toLocaleDateString()}
                      </Badge>
                    </div>

                    {competition.stages.map((stage, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{stage.name}</p>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {new Date(stage.startDate).toLocaleDateString()} - {' '}
                            {new Date(stage.endDate).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="mt-1">
                            {getStageStatus(stage.startDate, stage.endDate)}
                          </Badge>
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
                      <p className="text-4xl font-bold text-primary mb-4">{competition.prizePool}</p>
                    </div>

                    <div className="grid gap-4">
                      {competition.details.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{reward}</span>
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
                    <CardTitle>Event Contacts</CardTitle>
                    <CardDescription>
                      Get in touch with the event organizers for any queries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competition.contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                            {contact.phone && (
                              <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${contact.email}`}>
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </a>
                          </Button>
                          {contact.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${contact.phone}`}>
                                <Phone className="w-4 h-4 mr-1" />
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
              id: session?.user?._id || '',
              name: session?.user?.fullName || '',
              email: session?.user?.email || ''
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
  onPitchEvaluation
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
  const userId = session?.user?._id;
  let isLeader = false;
  let isTeamMember = false;
  let userMember: TeamMember | undefined;
  if (participant && userEmail) {
    if (participant.teamLeader.email === userEmail) {
      isLeader = true;
    } else {
      userMember = participant.teamMembers.find(
        m => m.email === userEmail
      );
      isTeamMember = !!userMember;
    }
  }
  const isValidated = participant?.teamStatus === 'validated';

  // ---- Add member modal logic ----
  const [addModal, setAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addEmailError, setAddEmailError] = useState<string | null>(null);

  // Email validation utility (copied from registration-form.tsx)
  function validateTeamMemberEmails(members: {email: string}[], teamLeaderEmail: string) {
    const errors: string[] = [];
    const seen = new Set<string>();
    const leaderEmailLower = teamLeaderEmail.trim().toLowerCase();
    members.forEach((member, idx) => {
      const email = member.email.trim();
      const emailLower = email.toLowerCase();
      if (!email) {
        errors[idx] = 'Email is required';
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors[idx] = 'Invalid email format';
        return;
      }
      if (emailLower === leaderEmailLower) {
        errors[idx] = 'Cannot invite yourself';
        return;
      }
      if (seen.has(emailLower)) {
        errors[idx] = 'Duplicate email';
        return;
      }
      seen.add(emailLower);
      errors[idx] = '';
    });
    return errors;
  }

  // Local state for participant update (for optimistic update when adding member)
  const [localParticipant, setLocalParticipant] = useState<Participant | null>(participant);

  // Compute (leader + accepted + pending)
  const teamCount = 1 + (localParticipant?.teamMembers.filter(m => m.status === 'pending' || m.status === 'accepted').length || 0);
  const maxTeam = competition.teamSize.max;
  // If leader AND team not full (ignoring declined), let them add
  const canAddMore = isLeader && teamCount < maxTeam;

  // Used to update local UI instead of window.location.reload
  const reFetchParticipant = useCallback(async () => {
    if (!localParticipant) return;
    try {
      const res = await axios.get(`/api/competitions/participants?competitionId=${competition._id}&userId=${localParticipant.teamLeader.email}`);
      if (res.data) setLocalParticipant(res.data);
    } catch (err) { /* do nothing, UI tolerant */ }
  }, [competition._id, localParticipant]);

  // When prop participant changes (after registration), sync local state
  useEffect(() => {
    setLocalParticipant(participant);
  }, [participant]);

  // Add member action (add is handled fully in state, not hard refresh)
  async function handleAddMember() {
    // Validation
    const trimmedEmail = newMemberEmail.trim();
    const emailsToCheck = [
      ...((localParticipant?.teamMembers || []).map(m => ({ email: m.email }))),
      { email: trimmedEmail }
    ];
    const errors = validateTeamMemberEmails(emailsToCheck, localParticipant?.teamLeader?.email || '');
    const thisError = errors[errors.length - 1];
    setAddEmailError(thisError || null);
    if (thisError) return;

    setAddLoading(true);
    try {
      const response = await axios.put('/api/competitions/participants', {
        participantId: localParticipant?._id,
        name: newMemberName,
        email: trimmedEmail,
      }, { validateStatus: () => true });
      if (response.status === 200 || response.data?.success) {
        toast.success('Invitation sent!');
        setAddModal(false);
        setNewMemberName('');
        setNewMemberEmail('');
        setAddEmailError(null);
        // Use returned participant; or re-fetch if not present
        if (response.data?.participant) {
          setLocalParticipant(response.data.participant);
        } else {
          await reFetchParticipant();
        }
      } else {
        toast.error(response.data?.error || 'Could not invite member.');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Network error.');
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Competition Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {!participant ? (
          // Not registered
          <>
            {!isAuthenticated ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sign In to Register</h4>
                  <p className="text-sm text-muted-foreground mb-4">Please sign in to register for this competition</p>
                </div>
                <Button asChild className="w-full"><Link href="/login">Sign In</Link></Button>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <Button
                    onClick={onShowRegistration}
                    disabled={!isRegistrationOpen}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isRegistrationOpen ? 'Register Now' : 'Registration Closed'}
                  </Button>
                  {!isRegistrationOpen && (
                    <p className="text-sm text-muted-foreground mt-2">Registration deadline has passed</p>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" />Registered Teams:</span>
                    <span className="font-semibold">{competition.totalRegistered}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="flex items-center gap-2"><User className="w-4 h-4" />Team Size:</span>
                    <span className="font-semibold">{competition.teamSize.min}-{competition.teamSize.max}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" />Deadline:</span>
                    <span className="font-semibold">{daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}</span>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // Registered (both leader and members see this team info)
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                <Award className="w-4 h-4" /> Your Team
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Team Name:</strong>
                  <p className="font-semibold text-primary">{localParticipant?.teamName || participant.teamName}</p>
                </div>
                <div>
                  <strong>Team Leader:</strong>
                  <p>{(localParticipant || participant).teamLeader.name} ({(localParticipant || participant).teamLeader.email})</p>
                </div>
                {(localParticipant || participant).teamMembers.length > 0 && (
                  <div>
                    <strong className="block mb-1">Team Members:</strong>
                    <ul className="space-y-1">
                      {(localParticipant || participant).teamMembers.map((member, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div
                            className={
                              member.status === 'accepted' ? 'w-2 h-2 rounded-full bg-green-500' :
                                member.status === 'declined' ? 'w-2 h-2 rounded-full bg-red-500 ' :
                                  'w-2 h-2 rounded-full bg-yellow-500'
                            }
                          />
                          {member.name} ({member.email})
                          <span className="ml-2 text-xs font-medium">
                            {member.status === 'pending' ? 'Pending' : member.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <Badge
                  variant={(localParticipant || participant).teamStatus === 'validated' ? 'outline' : (localParticipant || participant).teamStatus === 'incomplete' ? 'destructive' : 'outline'}
                  className={(localParticipant || participant).teamStatus === 'validated' ? 'bg-green-100 text-green-800' : (localParticipant || participant).teamStatus === 'incomplete' ? 'bg-destructive text-white' : ''}
                >
                  {(localParticipant || participant).teamStatus === 'validated' ? 'Team Ready' : (localParticipant || participant).teamStatus === 'incomplete' ? 'Team incomplete' : 'Team Disqualified'}
                </Badge>
              </div>
            </div>

            {/* Actions - only if teamLeader */}
            {isLeader && (
              <div className="space-y-3">
                {/* Leaderboard button - enabled only if team is validated */}
                <Button onClick={onLeaderboard} className="w-full" size="lg" disabled={!isValidated}>
                  <Trophy className="w-4 h-4 mr-2" /> Go to Leaderboard
                </Button>

                {/* Conditional buttons based on pitch submission and evaluation status */}
                {!(localParticipant || participant)?.pitchSubmitted ? (
                  /* Start Pitch - shown only if validated AND pitch not submitted */
                  <Button
                    onClick={onStartPitch}
                    variant="outline"
                    className="w-full"
                    size="lg"
                    disabled={!isValidated}
                  >
                    Start Pitch
                  </Button>
                ) : !(localParticipant || participant)?.pitchEvaluated ? (
                  /* Evaluate Pitch - shown if pitch submitted but not evaluated */
                  <>
                    <Button
                      onClick={onPitchEvaluation}
                      className="w-full"
                      size="lg"
                      variant="destructive"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Evaluate Pitch
                    </Button>
                    <div className="text-center">
                      <Badge variant="destructive" className="text-xs">
                        ⚠️ Evaluation pending - Complete evaluation to see your rank
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
                )}
              </div>
            )}

            {/* Team member view: show team info only, no action buttons */}
            {isTeamMember && !isLeader && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">
                  You are a team member. Team leader manages actions.
                </p>
              </div>
            )}
            {localParticipant && (
              <>
                {isLeader && canAddMore && (
                  <>
                    <Button onClick={() => setAddModal(true)} variant="outline" className="w-full mb-1">Invite Another Member</Button>
                    {addModal && (
                      <Dialog open={addModal} onOpenChange={v => setAddModal(v)}>
                        <DialogContent className="max-w-full">
                          <Card>
                            <CardHeader>
                              <CardTitle>Add Team Member</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                              <Input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Full Name" className="h-11" />
                              <Input value={newMemberEmail} type="email" onChange={e => setNewMemberEmail(e.target.value)} placeholder="Email Address" className={`h-11${addEmailError ? ' border-destructive' : ''}`} />
{addEmailError && (
  <div className="text-destructive text-xs mt-1">{addEmailError}</div>
)}
                            </CardContent>
                            <CardFooter className="justify-between">
                              <Button onClick={() => setAddModal(false)} variant="outline">Cancel</Button>
                              <Button disabled={addLoading || !newMemberName || !newMemberEmail}
                                onClick={handleAddMember}>Send Invite</Button>
                            </CardFooter>
                          </Card>
                        </DialogContent>
                      </Dialog>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
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

  if (now < start) return 'Upcoming';
  if (now >= start && now <= end) return 'Active';
  return 'Completed';
}