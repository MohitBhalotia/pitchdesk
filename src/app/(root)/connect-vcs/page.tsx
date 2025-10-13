"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Crown, Mail, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ConnectVCsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<string>("");

  useEffect(() => {
    // Check if user is enterprise, if not redirect
    const checkAccess = async () => {
      if (!session?.user?._id) return;

      try {
        const response = await fetch(`/api/users/stats?userId=${session.user._id}`);
        const userStats = await response.json();
        
        if (userStats.planName !== "enterprise") {
          router.push("/dashboard");
          return;
        }
        
        setUserPlan(userStats.planName);
      } catch (error) {
        console.error("Error checking user access:", error);
        router.push("/dashboard");
      }
    };

    checkAccess();
  }, [session, router]);

  if (!userPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
         
          
          <div className="flex justify-center items-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <Badge variant="secondary" className="text-sm">
              Enterprise Exclusive
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            VC Network Access
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exclusive network connecting you directly with venture capitalists
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Coming Soon!</CardTitle>
            <CardDescription className="text-base">
              We&apos;re building an exclusive VC network for our Enterprise members
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-center">
              We&apos;re currently curating our network of 100+ venture capitalists and building the platform for direct introductions. As an Enterprise member, you&apos;ll be the first to get access.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Mail className="h-8 w-8 text-blue-500" />
                    <h3 className="font-semibold text-foreground">Get Early Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Contact us for priority waitlist and demo access
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Calendar className="h-8 w-8 text-green-500" />
                    <h3 className="font-semibold text-foreground">Schedule Introduction</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct introductions to our partner VCs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Ready to connect now?
                    </h3>
                    <p className="text-muted-foreground">
                      Our partnerships team can arrange direct introductions
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="gap-2">
                      <a href="mailto:info@pitchdesk.in">
                        <Mail className="h-4 w-4" />
                        info@pitchdesk.in
                      </a>
                    </Button>
                    {/* <Button variant="outline" asChild className="gap-2">
                      <a href="mailto:founders@pitchdesk.in">
                        <Users className="h-4 w-4" />
                        founders@pitchdesk.in
                      </a>
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}