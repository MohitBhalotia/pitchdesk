"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, CheckCircle, XCircle } from 'lucide-react';

export default function InviteCompetitionPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const teamId = searchParams?.get("teamId") ?? null;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [handled, setHandled] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<null | 'accepted'|'declined'|'error'>(null);
  const [info, setInfo] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  // Require login/signup if not authenticated
  useEffect(() => {
    if (!token || !teamId) return;
    if (status === "loading") return;
    if (status !== "authenticated") {
      signIn(undefined, { callbackUrl: `/invite-competition?token=${encodeURIComponent(token)}&teamId=${encodeURIComponent(teamId)}` });
    }
  }, [status, token, teamId]);

  // Core accept/decline handler
  async function respondToInvite(action: 'accept'|'decline') {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/competitions/participants/invite-response', { token, action, teamId }, { validateStatus: () => true });
      if(res.status === 200) {
        // Fix: Map the action to the correct status value
        const status = action === 'accept' ? 'accepted' : 'declined';
        setInviteStatus(status);
        setHandled(true);
        setInfo(action === 'accept' ? "You have joined the team!" : "You have declined the invitation.");
      } else {
        setError(res.data?.error || "An error occurred. Try again.");
        setInviteStatus('error');
      }
    } catch (e:any) {
      setError(e.response?.data?.error || 'Could not process request.');
      setInviteStatus('error');
    } finally {
      setLoading(false);
    }
  }

  if (!token || !teamId) {
    return <Card className="max-w-lg mx-auto my-36"><CardHeader><CardTitle>Invalid Link</CardTitle></CardHeader><CardContent>This invitation link is invalid or broken.</CardContent></Card>;
  }

  if (status === "loading" || loading) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh]"><Loader className="animate-spin w-8 h-8 mb-2" />Processing...</div>;
  }

  if (handled) {
    return <Card className="max-w-lg mx-auto my-36 border-primary"><CardHeader><CardTitle>Invitation {inviteStatus === 'accepted' ? 'Accepted!' : 'Declined'}</CardTitle></CardHeader><CardContent className="flex flex-col items-center gap-4">
      {inviteStatus === 'accepted' ? <CheckCircle className="w-12 h-12 text-green-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
      <div>{info}</div>
      <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
    </CardContent></Card>;
  }

  return (
    <Card className="max-w-lg mx-auto my-36">
      <CardHeader>
        <CardTitle>Join Your Team</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-lg font-medium">You've been invited to join a team for a competition on Pitch Desk.</div>
        {!!error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex gap-4 justify-center">
          <Button variant="default" className="px-6" onClick={() => respondToInvite('accept')} disabled={loading}>Accept Invite</Button>
          <Button variant="outline" className="px-6" onClick={() => respondToInvite('decline')} disabled={loading}>Decline</Button>
        </div>
      </CardContent>
    </Card>
  );
}