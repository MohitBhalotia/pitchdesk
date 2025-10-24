"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail } from "lucide-react";

export default function VerificationPending() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Verification in Progress
          </CardTitle>
          <p className="text-muted-foreground">
            Thank you for registering as a Venture Capitalist!
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
            <AlertDescription className="text-blue-800 dark:text-blue-300">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ul className="space-y-1.5 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Our team will manually verify your VC credentials
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  This process typically takes 24-48 hours
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  You&apos;ll receive an email once verified
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  You can then login and access the VC dashboard
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>If you have any questions, contact us at:</p>
            <div className="flex items-center justify-center gap-2 font-medium text-foreground">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:info@pitchdesk.in" 
                className="hover:text-primary transition-colors"
              >
                info@pitchdesk.in
              </a>
            </div>
          </div>

          <Button 
            onClick={() => router.push("/")} 
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}