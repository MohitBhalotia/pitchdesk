import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import UserModel from "@/models/UserModel"
import bcrypt from "bcryptjs"
