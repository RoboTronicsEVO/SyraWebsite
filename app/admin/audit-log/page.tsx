"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminAuditLogPage() {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/audit-log");
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        setError("Failed to load audit log.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const user = (session?.user ?? {}) as { role?: string };
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
        <h1 className="text-2xl font-bold mb-6">Audit Log</h1>
        {loading ? (
          <div>Loading audit log...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-600">No admin actions found.</div>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">When</th>
                <th className="p-2 text-left">Admin</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Target User</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t">
                  <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-2">{log.adminEmail}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.targetUserEmail}</td>
                  <td className="p-2">{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
} 