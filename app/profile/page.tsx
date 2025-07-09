import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import ProfileButton from '@/components/auth/ProfileButton';
import Link from 'next/link';

async function getUserSchool(email: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/schools', { cache: 'no-store' });
  const data = await res.json();
  return (data.schools || []).find((s: any) => s.adminEmail === email);
}

async function getUserTeams(userId: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/teams', { cache: 'no-store' });
  const data = await res.json();
  return (data.teams || []).filter((t: any) => t.captainId === userId || (t.members && t.members.some((m: any) => m.userId === userId)));
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any) as any;
  if (!session) {
    redirect('/signin');
    return;
  }
  const user = session.user;
  if (user.role !== 'admin' && user.role !== 'school-admin') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">Profile is only available to admin and school-admin users.</p>
        </div>
      </main>
    );
  }
  let school = null;
  let teams = [];
  if (user.role === 'school-admin') {
    school = await getUserSchool(user.email);
  }
  teams = await getUserTeams(user.id);
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-md">
        <ProfileButton />
        <div className="mt-6 space-y-2">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
          <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-medium">{user.role}</span>
          {user.verified ? (
            <span className="inline-block ml-2 px-2 py-1 text-xs rounded bg-green-100 text-green-800 font-medium">Verified</span>
          ) : (
            <span className="inline-block ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 font-medium">Unverified</span>
          )}
        </div>
        {!user.verified && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
            <p className="mb-2">Your account is not verified. Please check your email for a verification link.</p>
            <button className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded cursor-not-allowed" disabled>Resend Verification Email (Coming Soon)</button>
          </div>
        )}
        {school && (
          <div className="mt-6">
            <h3 className="font-semibold text-md mb-1">School</h3>
            <div className="bg-gray-50 border rounded p-3">
              <p className="font-medium">{school.name}</p>
              <p className="text-sm text-gray-500">{school.address}</p>
              <p className="text-sm text-gray-500">{school.contactEmail}</p>
            </div>
          </div>
        )}
        {teams.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-md mb-1">Teams</h3>
            <ul className="space-y-2">
              {teams.map((team: any) => (
                <li key={team._id || team.id} className="bg-gray-50 border rounded p-3 flex justify-between items-center">
                  <span>{team.name}</span>
                  <Link href={`/teams/${team._id || team.id}`} className="text-blue-600 text-xs hover:underline">View</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold text-md mb-2">Account Settings</h3>
          <form className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border px-3 py-2 rounded" defaultValue={user.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Change Password</label>
              <input type="password" className="w-full border px-3 py-2 rounded" placeholder="New password" disabled />
            </div>
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>Save Changes (Coming Soon)</button>
          </form>
        </div>
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold text-md mb-2">Edit Profile</h3>
          <form className="space-y-4 max-w-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border px-3 py-2 rounded" defaultValue={user.name} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input type="password" className="w-full border px-3 py-2 rounded" placeholder="New password" disabled />
            </div>
            <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed" disabled>Update Profile (Coming Soon)</button>
          </form>
        </div>
        <div className="mt-8 border-t pt-6">
          <h3 className="font-semibold text-md mb-2">Two-Factor Authentication (2FA)</h3>
          <div className="flex items-center gap-4">
            <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 font-medium">2FA is currently <b>disabled</b></span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-not-allowed" disabled>Enable 2FA (Coming Soon)</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Add an extra layer of security to your account. (Feature coming soon)</p>
        </div>
      </div>
    </main>
  );
}