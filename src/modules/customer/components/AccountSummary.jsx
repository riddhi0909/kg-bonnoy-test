"use client";

/**
 * @param {{ viewer: object | null; loading: boolean }} props
 */
export function AccountSummary({ viewer, loading }) {
  if (loading) return <p className="text-zinc-500">Loading…</p>;
  if (!viewer) return <p className="text-zinc-500">Not signed in.</p>;
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <p className="font-semibold">{viewer.username}</p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{viewer.email}</p>
    </div>
  );
}
