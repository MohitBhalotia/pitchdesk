import mongoose from "mongoose"
import dbConnect from "@/lib/db"
import  PitchModel  from "@/models/PitchModel"

async function seed() {
  await dbConnect()

  const userId = "6886923965ec64a7db9f69a9" // replace with an existing User _id in your DB

  const dummyPitches = [
    {
      userId,
      duration: 300,
      conversationHistory: [
        {
          role: "user",
          content: "I want to pitch an AI tool that helps startups refine their investor decks.",
          timestamp: new Date("2025-09-15T10:00:00Z")
        },
        {
          role: "bot",
          content: "That sounds interesting! What problem does it solve for founders?",
          timestamp: new Date("2025-09-15T10:01:00Z")
        },
        {
          role: "user",
          content: "Most founders struggle to structure their pitch clearly, so this tool gives real-time feedback.",
          timestamp: new Date("2025-09-15T10:02:30Z")
        }
      ]
    },
    {
      userId,
      duration: 180,
      conversationHistory: [
        {
          role: "user",
          content: "I’m thinking about a pitch for a marketplace connecting local farmers with urban buyers.",
          timestamp: new Date("2025-09-16T09:30:00Z")
        },
        {
          role: "bot",
          content: "Nice! How would you ensure logistics and delivery efficiency?",
          timestamp: new Date("2025-09-16T09:31:15Z")
        },
        {
          role: "user",
          content: "We'd partner with existing last-mile delivery startups to handle transportation.",
          timestamp: new Date("2025-09-16T09:32:45Z")
        }
      ]
    },
    {
      userId,
      duration: 240,
      conversationHistory: [
        {
          role: "user",
          content: "Here's another pitch idea: a subscription box for sustainable household products.",
          timestamp: new Date("2025-09-17T14:20:00Z")
        },
        {
          role: "bot",
          content: "Great niche! What's your plan to acquire your first 100 customers?",
          timestamp: new Date("2025-09-17T14:21:30Z")
        },
        {
          role: "user",
          content: "We'd start with eco-conscious communities and run targeted social media ads.",
          timestamp: new Date("2025-09-17T14:23:10Z")
        }
      ]
    }
  ]

  await PitchModel.insertMany(dummyPitches)
  console.log("✅ Dummy pitches inserted!")

  await mongoose.disconnect()
}

seed().catch(err => console.error(err))
