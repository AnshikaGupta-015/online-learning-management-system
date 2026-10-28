import React, { useState, useEffect } from 'react';
import { Search, Shield, UserX, UserCheck, MoreVertical } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const AdminUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'instructor' | 'admin'>('all');

  const [usersList, setUsersList] = useState([
    { id: 'usr_01', name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'student', status: 'active', joined: 'Jan 2025', coursesEnrolled: 2 },
    { id: 'usr_02', name: 'Dr. Sarah Chen', email: 'sarah.chen@learnova.edu', role: 'instructor', status: 'active', joined: 'Aug 2023', coursesEnrolled: 0 },
    { id: 'usr_03', name: 'Marcus Vance', email: 'marcus.vance@learnova.com', role: 'admin', status: 'active', joined: 'Jan 2023', coursesEnrolled: 0 },
    { id: 'usr_04', name: 'Tariq Al-Mansoor', email: 'tariq.sre@cloudops.org', role: 'instructor', status: 'active', joined: 'May 2024', coursesEnrolled: 1 },
    { id: 'usr_05', name: 'Devon Miller', email: 'devon.miller@company.io', role: 'student', status: 'active', joined: 'Mar 2025', coursesEnrolled: 3 },
  ]);

  useEffect(() => {
    // Load persisted users from Firestore
    getDocs(collection(db, 'users'))
      .then((snapshot) => {
        if (!snapshot.empty) {
          const dbUsers: any[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            dbUsers.push({
              id: data.id || doc.id,
              name: data.name || 'Anonymous User',
              email: data.email || 'user@learnova.edu',
              role: data.role || 'student',
              status: 'active',
              joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
              coursesEnrolled: 1,
            });
          });

          setUsersList((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const newOnes = dbUsers.filter((u) => !existingIds.has(u.id));
            return [...prev, ...newOnes];
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const filtered = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User & Identity Directory
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Manage accounts, role assignments, student status, and platform access control.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs self-start sm:self-auto">
            {(['all', 'student', 'instructor', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded font-medium capitalize transition-colors ${
                  roleFilter === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Member Since</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      u.role === 'admin'
                        ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                        : u.role === 'instructor'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums">{u.joined}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      u.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="px-2.5 py-1 text-[11px] font-medium border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
