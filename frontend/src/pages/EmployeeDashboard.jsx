import { useState, useEffect } from 'react';
import api from '../services/api';

export default function EmployeeDashboard() {
  const [empStats, setEmpStats] = useState({
    pendingTasks: 0,
    attendanceTime: '09:02 AM' // Placeholder
  });

  useEffect(() => {
    fetchEmpStats();
  }, []);

  const fetchEmpStats = async () => {
    try {
      const { data } = await api.get('/tasks');
      setEmpStats(prev => ({
        ...prev,
        pendingTasks: data.filter(t => t.status !== 'completed').length
      }));
    } catch (err) {
      console.error('Failed to fetch employee stats', err);
    }
  };

  const stats = [
    { label: 'Attendance Today', value: empStats.attendanceTime, subValue: 'Checked In', status: 'success', icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    )},
    { label: 'Pending Tasks', value: empStats.pendingTasks, subValue: 'Action Required', status: 'warning', icon: (
      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
      </svg>
    )},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.status === "success"
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {stat.subValue}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
              {stat.value}
            </p>
            {stat.label === "Attendance Today" && (
              <button
                onClick={() => alert("Check Out clicked")}
                className="mt-4 w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-xl transition-colors"
              >
                Check Out
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Announcements
          </h3>
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Q2 Payroll processed on 28th",
              date: "2 hours ago",
              emoji: "📢",
            },
            {
              title: "Company picnic this Friday",
              date: "1 day ago",
              emoji: "🎉",
            },
          ].map((announcement, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl border border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <span className="text-2xl">{announcement.emoji}</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {announcement.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {announcement.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
