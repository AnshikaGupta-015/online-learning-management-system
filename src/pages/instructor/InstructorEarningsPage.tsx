import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const InstructorEarningsPage: React.FC = () => {
  const [payoutRequested, setPayoutRequested] = useState(false);

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  const transactions = [
    { id: 'tx_01', date: '2026-10-24', description: 'Net enrollment revenue (Oct batch)', amount: 245000, status: 'completed' },
    { id: 'tx_02', date: '2026-09-30', description: 'Direct bank transfer to HDFC Bank (****4912)', amount: -580000, status: 'paid' },
    { id: 'tx_03', date: '2026-09-25', description: 'Net enrollment revenue (Sep batch)', amount: 620000, status: 'completed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Earnings & Revenue Payouts
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Track student enrollment royalties, platform commission splits, and automated bank remittances.
          </p>
        </div>

        <button
          onClick={handleRequestPayout}
          disabled={payoutRequested}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{payoutRequested ? 'Payout Processing...' : 'Request Payout (₹8,45,000)'}</span>
        </button>
      </div>

      {payoutRequested && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Payout request of ₹8,45,000 initiated! Funds will be routed to registered verified account within 24 hours.</span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Payout Balance</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-2">
            ₹8,45,000
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">Ready for immediate withdrawal</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Lifetime Royalties</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-2">
            ₹1,34,42,000
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Across 38,420 enrolled students</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Platform Revenue Share</span>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums mt-2">
            85% / 15%
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Tier 1 Lead Instructor Tier</span>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Ledger & Payout History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Reference & Description</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-sans font-medium text-slate-900 dark:text-white">{tx.description}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{tx.date}</td>
                  <td className="p-4 text-center font-sans">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                      tx.status === 'paid'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold ${
                    tx.amount < 0 ? 'text-slate-500 dark:text-slate-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {tx.amount < 0 ? '-' : '+'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
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
