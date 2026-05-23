import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [managerStats, setManagerStats] = useState({
    totalEmployees: 0,
    activeNow: 0,
    pendingLeaves: 0,
  });

  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchEmployeesList();
  }, []);

  const fetchEmployeesList = async () => {
    try {
      const { data } = await api.get("/auth/employees");
      setEmployeesList(data.slice(0, 5)); // Show only first 5
    } catch (err) {
      console.error("Failed to fetch employees list", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [empRes, leaveRes] = await Promise.all([
        api.get("/auth/employees"),
        api.get("/leave"),
      ]);

      setManagerStats({
        totalEmployees: empRes.data.length,
        activeNow: empRes.data.length, // Placeholder logic
        pendingLeaves: leaveRes.data.filter((l) => l.status === "pending")
          .length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const stats = [
    {
      label: "Total Employees",
      value: managerStats.totalEmployees,
      trend: "+0%",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Active Now",
      value: managerStats.activeNow,
      trend: "Steady",
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Pending Leaves",
      value: managerStats.pendingLeaves,
      trend: "Alert",
      icon: (
        <svg
          className="w-6 h-6 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  stat.trend.startsWith("+")
                    ? "bg-green-50 text-green-600"
                    : stat.trend.startsWith("-")
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-50 text-slate-600"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {stat.label}
            </h3>
            <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Team Overview
            </h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {employeesList.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No employees found.
              </p>
            ) : (
              employeesList.map((emp, i) => (
                <div
                  key={emp._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {emp.name}
                      </p>
                      <p className="text-xs text-slate-500">{emp.department}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                label: "Add Employee",
                color: "bg-indigo-600",
                hover: "hover:bg-indigo-700",
                action: () => navigate("/register"),
              },
              {
                label: "Approve Leaves",
                color: "bg-emerald-600",
                hover: "hover:bg-emerald-700",
                action: () => navigate("/dashboard/leave"),
              },
              {
                label: "View Reports",
                color: "bg-violet-600",
                hover: "hover:bg-violet-700",
                action: () => navigate("/dashboard/tasks"),
              },
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className={`w-full py-3 px-4 ${action.color} ${action.hover} text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
