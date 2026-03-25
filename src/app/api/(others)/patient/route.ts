import { NextRequest, NextResponse } from "next/server";



export const patients = [
    {
        id: 1,
        firstName: "Lisa",
        lastName: "Brown",
        dob: "1988-01-25",
    },
    {
        id: 2,
        firstName: "Michael",
        lastName: "Davis",
        dob: "1992-03-15",
    },
    {
        id: 3,
        firstName: "Emily",
        lastName: "White",
        dob: "1995-07-10",
    },
    {
        id: 4,
        firstName: "David",
        lastName: "Johnson",
        dob: "1990-01-13",
    },
    {
        id: 5,
        firstName: "John",
        lastName: "Doe",
        dob: "1990-05-01",
    },
]
export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, dob } = await req.json();
        if (!firstName || !lastName || !dob) {
            return NextResponse.json({ msg: 'Missing required fields: firstName, lastName, and dob are required' }, { status: 400 });
        }

        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            return NextResponse.json({ msg: 'Invalid dob format; use ISO date or YYYY-MM-DD' }, { status: 400 });
        }

        const patient = patients.find(p => p.firstName.toLowerCase() === firstName.toLowerCase() && p.lastName.toLowerCase() === lastName.toLowerCase() && p.dob === dob);

        if (!patient) {
            return NextResponse.json({ msg: 'Patient not found' }, { status: 404 });
        }
        await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 2000)));


        return NextResponse.json({ patientId: patient.id }, { status: 200 });
    } catch (error) {
        console.error('Error in findPatientByDemographicsApi:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}