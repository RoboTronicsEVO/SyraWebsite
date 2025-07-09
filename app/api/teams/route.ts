import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Team from '@/models/team.model';
import { teamSchema } from '@/lib/validation';

export async function GET() {
  await connectToDatabase();
  const teams = await Team.find().lean();
  return NextResponse.json({ teams });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const data = await request.json();

  // Validate input and enforce 2-5 members
  const parse = teamSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });
  }
  if (data.members.length < 2 || data.members.length > 5) {
    return NextResponse.json({ error: 'Team must have 2-5 members.' }, { status: 400 });
  }

  // Create team
  const team = await Team.create({ ...data });
  return NextResponse.json({ team });
}

export async function PATCH(request: NextRequest) {
  await connectToDatabase();
  const data = await request.json();
  const { teamId, name, competitionId } = data;
  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required.' }, { status: 400 });
  }
  const update: any = {};
  if (name) update.name = name;
  if (competitionId) update.competitionId = competitionId;
  const team = await Team.findByIdAndUpdate(teamId, update, { new: true });
  if (!team) {
    return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
  }
  return NextResponse.json({ team });
} 