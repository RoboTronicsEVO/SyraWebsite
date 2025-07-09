"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { showToast } from "@/components/ui/Toast";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAdminAction = async (userId: string, action: string, value?: string) => {
    setActionLoading(userId + action);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast.error("Action failed", data.error || "Could not update user.");
      } else {
        setUsers((prev) => prev.map((u) => (u._id === userId ? data.user : u)));
        showToast.success("User updated");
      }
    } catch (err) {
      showToast.error("Network error", "Could not update user.");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const user = (session?.user ?? {}) as { role?: string; email?: string };
  if (!user.role || user.role !== "admin") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-neutral-600">This page is only available to admin users.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        {loading ? (
          <div>Loading users...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Verified</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role}
                    {user.email !== (session?.user?.email ?? '') && (
                      <>
                        <select className="ml-2 border rounded px-1 py-0.5 text-xs" disabled>
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="coach">Coach</option>
                          <option value="school-admin">School Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button className="ml-1 px-2 py-0.5 text-xs bg-gray-300 rounded cursor-not-allowed" disabled>Save</button>
                      </>
                    )}
                  </td>
                  <td className="p-2">
                    {user.verified ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 font-medium">Verified</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 font-medium">Unverified</span>
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    {user.email !== (session?.user?.email ?? '') && (
                      <>
                        <button
                          className="text-blue-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
                          disabled={user.verified || actionLoading === user._id + 'verify'}
                          onClick={() => handleAdminAction(user._id, 'verify')}
                        >
                          {actionLoading === user._id + 'verify' ? 'Verifying...' : 'Verify'}
                        </button>
                        <button
                          className="text-red-600 hover:underline cursor-pointer disabled:cursor-not-allowed"
                          disabled={actionLoading === user._id + (user.isActive ? 'deactivate' : 'activate')}
                          onClick={() => handleAdminAction(user._id, user.isActive ? 'deactivate' : 'activate')}
                        >
                          {actionLoading === user._id + (user.isActive ? 'deactivate' : 'activate') ? (user.isActive ? 'Deactivating...' : 'Activating...') : user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <select
                          className="ml-2 border rounded px-1 py-0.5 text-xs"
                          value={user.role}
                          onChange={e => handleAdminAction(user._id, 'changeRole', e.target.value)}
                          disabled={actionLoading === user._id + 'changeRole'}
                        >
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="coach">Coach</option>
                          <option value="school-admin">School Admin</option>
                          <option value="admin">Admin</option>
                        </select>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
} 