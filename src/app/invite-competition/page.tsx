"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, CheckCircle, XCircle } from 'lucide-react';
import {Suspense} from "react";
function InviteCompetitionContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;
  const teamId = searchParams?.get("teamId") ?? null;
  const { status } = useSession();
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
      // Store the invite URL as a redirect parameter
      const redirectUrl = `/invite-competition?token=${encodeURIComponent(token)}&teamId=${encodeURIComponent(teamId)}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [status, token, teamId, router]);

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
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e) {
      setError(e.response?.data?.error || 'Could not process request.');
      setInviteStatus('error');
    } finally {
      setLoading(false);
    }
  }

  if (!token || !teamId) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-lg mx-auto my-16 sm:my-24 lg:my-36">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent className="text-sm sm:text-base">
            This invitation link is invalid or broken.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh]">
          <Loader className="animate-spin w-6 h-6 sm:w-8 sm:h-8 mb-2" />
          <p className="text-sm sm:text-base">Processing...</p>
        </div>
      </div>
    );
  }

  if (handled) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <Card className="max-w-lg mx-auto my-16 sm:my-24 lg:my-36 border-primary">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">
              Invitation {inviteStatus === 'accepted' ? 'Accepted!' : 'Declined'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 px-4 sm:px-6">
            {inviteStatus === 'accepted' ? (
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            ) : (
              <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
            )}
            <div className="text-sm sm:text-base text-center">{info}</div>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <Card className="max-w-lg mx-auto my-16 sm:my-24 lg:my-36">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Join Your Team</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="text-base sm:text-lg font-medium">
            You&apos;ve been invited to join a team for a competition on Pitch Desk.
          </div>
          {!!error && (
            <div className="text-red-500 text-xs sm:text-sm mt-2 break-words">{error}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              variant="default" 
              className="w-full sm:w-auto px-6" 
              onClick={() => respondToInvite('accept')} 
              disabled={loading}
            >
              Accept Invite
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto px-6" 
              onClick={() => respondToInvite('decline')} 
              disabled={loading}
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InviteCompetitionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteCompetitionContent />
    </Suspense>
  );
}