import React, { useState } from 'react';
import { Search, Mail, CheckCircle2, Clock } from 'lucide-react';

export const InstructorStudentsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const students = [
    { id: 'st_1', name: 'Alex Rivera', email: 'alex.rivera@example.com', enrolledDate: 'Sep 15, 2026', progress: 35, lastActive: 'Today', status: 'Active' },
    { id: 'st_2', name: 'Vikram Joshi', email: 'vikram.j@outlook.com', enrolledDate: 'Aug 20, 2026', progress: 100, lastActive: '2 days ago', status: 'Completed' },
    { id: 'st_3', name: 'Maya Lin', email: 'maya.lin@domain.org', enrolledDate: 'Oct 02, 2026', progress: 68, lastActive: 'Yesterday', status: 'Active' },
    { id: 'st_4', name: 'David Kim', email: 'david.kim@techlab.io', enrolledDate: 'Oct 11, 2026', progress: 12, lastActive: '3 days ago', status: 'Active' },
  ];

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enrolled Student Roster
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Monitor learner progress, completion benchmarks, and engagement across your active masterclasses.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            Showing {filtered.length} of 38,420 students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Enrolled Date</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{st.email}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-mono tabular-nums">{st.enrolledDate}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${st.progress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'}`}
                          style={{ width: `${st.progress}%` }}
                        />
                      </div>
                      <span>{st.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{st.lastActive}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      st.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {st.status}
                    </span>
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
