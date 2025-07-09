import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-config";
import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/models/auditlog.model";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();
  const logs = await AuditLog.find({}, {
    adminEmail: 1,
    action: 1,
    targetUserEmail: 1,
    details: 1,
    createdAt: 1,
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  return NextResponse.json({ logs });
} 