import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Bell, Key, Check } from 'lucide-react';

export const StudentSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [headline, setHeadline] = useState(user?.headline || 'Aspiring Distributed Systems Engineer');
  const [bio, setBio] = useState(user?.bio || 'Self-directed learner focused on cloud architecture and microservices.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Manage your student credentials, public profile, and notification preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name || 'User'}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email}</p>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 capitalize">
                Role: {user?.role}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address (Managed)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'alex.rivera@example.com'}
                className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Academic & Professional Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
