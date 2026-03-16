import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const doctors = [
          {
            "id": "DOC001",
            "name": "Dr. Emily Carter",
            "specialization": "Cardiologist",
            "contact": {
              "phone": "+1 (555) 201-4321",
              "email": "e.carter@medclinic.com"
            },
            "availability": [
              { "day": "Monday",    "start": "09:00", "end": "13:00" },
              { "day": "Wednesday", "start": "14:00", "end": "18:00" },
              { "day": "Friday",    "start": "09:00", "end": "12:00" }
            ]
          },
          {
            "id": "DOC002",
            "name": "Dr. James Nguyen",
            "specialization": "Neurologist",
            "contact": {
              "phone": "+1 (555) 302-7654",
              "email": "j.nguyen@medclinic.com"
            },
            "availability": [
              { "day": "Tuesday",   "start": "08:00", "end": "12:00" },
              { "day": "Thursday",  "start": "13:00", "end": "17:00" },
              { "day": "Saturday",  "start": "09:00", "end": "13:00" }
            ]
          },
          {
            "id": "DOC003",
            "name": "Dr. Sofia Martinez",
            "specialization": "Pediatrician",
            "contact": {
              "phone": "+1 (555) 403-8910",
              "email": "s.martinez@medclinic.com"
            },
            "availability": [
              { "day": "Monday",    "start": "10:00", "end": "14:00" },
              { "day": "Wednesday", "start": "09:00", "end": "13:00" },
              { "day": "Friday",    "start": "13:00", "end": "17:00" }
            ]
          },
          {
            "id": "DOC004",
            "name": "Dr. Michael Okafor",
            "specialization": "Orthopedic Surgeon",
            "contact": {
              "phone": "+1 (555) 504-2233",
              "email": "m.okafor@medclinic.com"
            },
            "availability": [
              { "day": "Tuesday",   "start": "07:00", "end": "11:00" },
              { "day": "Thursday",  "start": "14:00", "end": "18:00" },
              { "day": "Friday",    "start": "08:00", "end": "12:00" }
            ]
          },
          {
            "id": "DOC005",
            "name": "Dr. Priya Sharma",
            "specialization": "Dermatologist",
            "contact": {
              "phone": "+1 (555) 605-3344",
              "email": "p.sharma@medclinic.com"
            },
            "availability": [
              { "day": "Monday",    "start": "13:00", "end": "17:00" },
              { "day": "Wednesday", "start": "09:00", "end": "13:00" },
              { "day": "Saturday",  "start": "10:00", "end": "14:00" }
            ]
          },
          {
            "id": "DOC006",
            "name": "Dr. Robert Chen",
            "specialization": "Psychiatrist",
            "contact": {
              "phone": "+1 (555) 706-4455",
              "email": "r.chen@medclinic.com"
            },
            "availability": [
              { "day": "Tuesday",   "start": "09:00", "end": "13:00" },
              { "day": "Thursday",  "start": "09:00", "end": "13:00" },
              { "day": "Friday",    "start": "14:00", "end": "18:00" }
            ]
          },
          {
            "id": "DOC007",
            "name": "Dr. Amara Diallo",
            "specialization": "Oncologist",
            "contact": {
              "phone": "+1 (555) 807-5566",
              "email": "a.diallo@medclinic.com"
            },
            "availability": [
              { "day": "Monday",    "start": "08:00", "end": "12:00" },
              { "day": "Wednesday", "start": "13:00", "end": "17:00" },
              { "day": "Friday",    "start": "08:00", "end": "11:00" }
            ]
          },
          {
            "id": "DOC008",
            "name": "Dr. Lucas Bauer",
            "specialization": "Gastroenterologist",
            "contact": {
              "phone": "+1 (555) 908-6677",
              "email": "l.bauer@medclinic.com"
            },
            "availability": [
              { "day": "Tuesday",   "start": "10:00", "end": "14:00" },
              { "day": "Thursday",  "start": "08:00", "end": "12:00" },
              { "day": "Saturday",  "start": "09:00", "end": "12:00" }
            ]
          },
          {
            "id": "DOC009",
            "name": "Dr. Yuki Tanaka",
            "specialization": "Endocrinologist",
            "contact": {
              "phone": "+1 (555) 109-7788",
              "email": "y.tanaka@medclinic.com"
            },
            "availability": [
              { "day": "Monday",    "start": "11:00", "end": "15:00" },
              { "day": "Wednesday", "start": "15:00", "end": "19:00" },
              { "day": "Friday",    "start": "09:00", "end": "13:00" }
            ]
          },
          {
            "id": "DOC010",
            "name": "Dr. Grace Owusu",
            "specialization": "Pulmonologist",
            "contact": {
              "phone": "+1 (555) 210-8899",
              "email": "g.owusu@medclinic.com"
            },
            "availability": [
              { "day": "Tuesday",   "start": "07:30", "end": "11:30" },
              { "day": "Thursday",  "start": "12:00", "end": "16:00" },
              { "day": "Saturday",  "start": "08:00", "end": "12:00" }
            ]
          }
        ]
    return NextResponse.json(doctors);
}