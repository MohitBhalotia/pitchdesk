import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { UserModel } from '@/models/UserModel';
import { CompanyModel } from '@/models/CompanyModel';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { fullname, email, password, role, company, websiteURL } = body;

  // Validate required fields
  if (!fullname || !email || !password || !role || !company || !websiteURL) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // Create or find company
  let companyDoc = await CompanyModel.findOne({ companyName: company });
  if (!companyDoc) {
    companyDoc = await CompanyModel.create({ companyName: company, websiteURL });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await UserModel.create({
    fullname,
    email,
    password: hashedPassword,
    role,
    userPlan: 'free',
    company: companyDoc._id,
  });

  return NextResponse.json({ message: 'User created', user: { id: user._id, email: user.email, fullname: user.fullname } }, { status: 201 });
}
