"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";

interface Competition {
  _id: string;
  title: string;
  pitchTime: number;
  teamSize: {
    min: number;
    max: number;
  };
}

interface TeamMember {
  name: string;
  email: string;
}

type TeamMember1 = {
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
  teamMembers: TeamMember1[];
  teamStatus: "disqualified" | "validated" | "incomplete";
  // status: 'registered' | 'submitted' | 'disqualified';
  pitchSubmitted: boolean;
  pitchEvaluated: boolean;
}

interface RegistrationFormProps {
  competition: Competition;
  onClose: () => void;
  onSuccess: (participant: Participant) => void;
  userData: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RegistrationForm({
  competition,
  onClose,
  onSuccess,
  userData,
}: RegistrationFormProps) {
  const [teamName, setTeamName] = useState("");
  const [teamLeader,setTeamLeader] = useState({
    name: userData.name,
    email: userData.email,
    phone: "",
    collegeName: "",
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const addTeamMember = () => {
    if (teamMembers.length < competition.teamSize.max - 1) {
      setTeamMembers([...teamMembers, { name: "", email: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  // Email validation utility
  function validateTeamMemberEmails(
    members: TeamMember[],
    teamLeaderEmail: string
  ) {
    const errors: string[] = [];
    const seen = new Set<string>();
    const leaderEmailLower = teamLeaderEmail.trim().toLowerCase();

    members.forEach((member, idx) => {
      const email = member.email.trim();
      const emailLower = email.toLowerCase();

      // Required
      if (!email) {
        errors[idx] = "Email is required";
        return;
      }
      // Format
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors[idx] = "Invalid email format";
        return;
      }
      // Not team leader
      if (emailLower === leaderEmailLower) {
        errors[idx] = "Cannot invite yourself";
        return;
      }
      // Duplicate
      if (seen.has(emailLower)) {
        errors[idx] = "Duplicate email";
        return;
      }
      seen.add(emailLower);
      errors[idx] = "";
    });
    return errors;
  }

  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate team size
    const totalTeamSize =
      1 + teamMembers.filter((member) => member.name && member.email).length;
    if (totalTeamSize < competition.teamSize.min) {
      toast.info(
        `Minimum team size is ${competition.teamSize.min}. Please add more team members.`
      );
      return;
    }

    // Email validations
    const trimmedMembers = teamMembers.map((m) => ({
      ...m,
      email: m.email.trim(),
    }));
    const errors = validateTeamMemberEmails(trimmedMembers, teamLeader.email);
    setEmailErrors(errors);
    if (errors.some((e) => e)) {
      return;
    }
    // Update trimmed emails
    setTeamMembers(trimmedMembers);

    setLoading(true);

    try {
      const response = await axios.post("/api/competitions/participants", {
        competitionId: competition._id,
        userId: userData.id,
        teamName,
        teamLeader,
        teamMembers: teamMembers.filter(
          (member) => member.name && member.email
        ),
        pitchTime: competition.pitchTime,
      });

      if (response.status === 201) {
        const participant = response.data;
        onSuccess(participant);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalTeamSize =
    1 + teamMembers.filter((member) => member.name && member.email).length;
  const canAddMoreMembers = teamMembers.length < competition.teamSize.max - 1;

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="p-3 flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            Register for {competition.title}
          </SheetTitle>
          <SheetDescription className="text-base">
            Fill in your team details to participate in this competition
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="h-screen flex flex-col">
          <div className="space-y-8 ">
            {/* Team Name */}
            <div className="space-y-3">
              <Label htmlFor="teamName" className="text-base">
                Team Name *
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                required
                className="h-12 text-base"
              />
            </div>

            {/* Team Leader - Read Only */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-base">Team Leader *</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 ">
                  <Label htmlFor="leaderName" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="leaderName"
                    value={teamLeader.name}
                    readOnly
                    className="h-11 "
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderCollegeName" className="text-sm">
                    College Name
                  </Label>
                  <Input
                    id="leaderCollegeName"
                    type="text"
                    value={teamLeader.collegeName||""}
                    onChange={(e) => setTeamLeader({ ...teamLeader, collegeName: e.target.value })}
                    className="h-11 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderEmail" className="text-sm">
                    Email
                  </Label>
                  <Input
                    id="leaderEmail"
                    type="email"
                    value={teamLeader.email}
                    readOnly
                    className="h-11 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderEmail" className="text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="leaderPhone"
                    type="text"
                    value={teamLeader.phone||""}
                    onChange={(e) => setTeamLeader({ ...teamLeader, phone: e.target.value })}
                    className="h-11 bg-background"
                  />
                </div>
              </div>
              
            </div>

            {/* Team Members */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-base">Team Members</h4>
                  <p className="text-sm text-muted-foreground">
                    Team size: {competition.teamSize.min} -{" "}
                    {competition.teamSize.max} members (Currently:{" "}
                    {totalTeamSize})
                  </p>
                </div>
                {canAddMoreMembers && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTeamMember}
                    className="h-10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                )}
              </div>

              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-4 items-end p-4 border rounded-lg bg-card"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`memberName-${index}`} className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id={`memberName-${index}`}
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(index, "name", e.target.value)
                      }
                      placeholder="Enter full name"
                      className="h-11 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`memberEmail-${index}`} className="text-sm">
                      Email
                    </Label>
                    <Input
                      id={`memberEmail-${index}`}
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateTeamMember(index, "email", e.target.value)
                      }
                      placeholder="Enter email address"
                      className={`h-11 w-full${emailErrors[index] ? " border-destructive" : ""}`}
                    />
                    {emailErrors[index] && (
                      <div className="text-destructive text-xs mt-1">
                        {emailErrors[index]}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    className="text-destructive h-11 w-11"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    No team members added yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {competition.teamSize.min > 1
                      ? `Add at least ${competition.teamSize.min - 1} more member(s) to continue`
                      : "Add team members if needed"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <CardFooter className="flex justify-end gap-2 mt-auto border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || totalTeamSize < competition.teamSize.min}
            >
              {loading
                ? "Registering..."
                : `Register Team (${totalTeamSize}/${competition.teamSize.max})`}
            </Button>
          </CardFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
