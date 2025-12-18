import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Participant from "@/models/Participant";

type ParticipantLean = {
  teamName: string;
  teamStatus: "validated" | "incomplete" | "disqualified";
  teamLeader: {
    name: string;
    email: string;
    collegeName: string;
  };
};

// GET /api/team-stats?competitionId=...
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const competitionId = searchParams.get("competitionId");

    if (!competitionId) {
      return NextResponse.json(
        { error: "Missing competitionId parameter" },
        { status: 400 }
      );
    }

    const participants = await Participant.find(
      { competitionId },
      {
        teamName: 1,
        teamStatus: 1,
        "teamLeader.name": 1,
        "teamLeader.email": 1,
        "teamLeader.collegeName": 1,
        _id: 0,
      }
    ).lean<ParticipantLean[]>();

    const mapTeam = (team: ParticipantLean) => ({
      teamName: team.teamName,
      leaderName: team.teamLeader.name,
      leaderEmail: team.teamLeader.email,
      leaderCollege: team.teamLeader.collegeName,
    });

    const allTeams = participants.map(mapTeam);

    const validatedTeams = participants
      .filter((team) => team.teamStatus === "validated")
      .map(mapTeam);

    const incompleteTeams = participants
      .filter((team) => team.teamStatus === "incomplete")
      .map(mapTeam);

    return NextResponse.json({
      allTeams,
      validatedTeams,
      incompleteTeams,
    });
  } catch (err) {
    console.error("Error fetching team stats:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
