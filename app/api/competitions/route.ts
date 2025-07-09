import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Competition from '@/models/competition.model';
import Team from '@/models/team.model';

export async function GET() {
  await connectToDatabase();
  const competitions = await Competition.find().lean();
  return NextResponse.json({ competitions });
}

// POST: Register a team for a competition
export async function POST(request: NextRequest) {
  await connectToDatabase();
  const { competitionId, teamId, schoolId } = await request.json();
  if (!competitionId || !teamId || !schoolId) {
    return NextResponse.json({ error: 'competitionId, teamId, and schoolId are required.' }, { status: 400 });
  }
  const competition = await Competition.findById(competitionId);
  if (!competition) {
    return NextResponse.json({ error: 'Competition not found.' }, { status: 404 });
  }
  // Check if maxTeams is reached
  if (competition.maxTeams && competition.registeredTeams.length >= competition.maxTeams) {
    return NextResponse.json({ error: 'Competition is full.' }, { status: 400 });
  }
  // Prevent duplicate registration
  if (competition.registeredTeams.includes(teamId)) {
    return NextResponse.json({ error: 'Team already registered for this competition.' }, { status: 409 });
  }
  // Check that the team belongs to the school
  const team = await Team.findById(teamId);
  if (!team) {
    return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
  }
  if (team.schoolId.toString() !== schoolId) {
    return NextResponse.json({ error: 'Team does not belong to this school.' }, { status: 403 });
  }
  // Register the team
  competition.registeredTeams.push(teamId);
  competition.currentTeams = competition.registeredTeams.length;
  await competition.save();
  return NextResponse.json({ competition });
} 