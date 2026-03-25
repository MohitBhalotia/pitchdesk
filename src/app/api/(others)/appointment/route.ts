import { NextRequest, NextResponse } from "next/server";
import { patients } from "../patient/route";

export async function POST(req: NextRequest) {
    try {
        const { patientId, startTime: startTimeRaw, endTime: endTimeRaw, status, appointmentType } = await req.json();
        if (!patientId || !startTimeRaw || !endTimeRaw || !status) {
            return NextResponse.json({ msg: 'Missing required fields: patientId, startTime, endTime, and status are required' }, { status: 400 });
        }

        const patient = patients.find(p => p.id === patientId);
        if (!patient) {
            return NextResponse.json({ msg: 'Patient not found' }, { status: 404 });
        }

        const startTime = new Date(startTimeRaw);
        const endTime = new Date(endTimeRaw);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return NextResponse.json({ msg: 'Invalid startTime or endTime; use ISO date strings' }, { status: 400 });
        }
        if (endTime.getTime() < startTime.getTime()) {
            return NextResponse.json({ msg: 'endTime must be after startTime' }, { status: 400 });
        }
        await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 2000)));
        

        return NextResponse.json({ msg: 'Appointment created successfully' }, { status: 201 });
        } catch (error) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    }