// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "../../../../../lib/db";
// import PitchModel from "@/models/PitchModel";
// import axios from "axios";
// import { userPlanModel } from "@/models/UserPlanModel";

// export async function PATCH() {
//   try {
//     await dbConnect();
//     console.log("Updating pitches");
//     const {pitchId,sessionId,competitionId,userId,} = await req.json();

//     return NextResponse.json(
//       { success: true, message: "Pitches updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating pitches", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
