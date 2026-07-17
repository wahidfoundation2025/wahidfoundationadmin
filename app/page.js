"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  Handshake,
  Users,
  TrendingUp,
  FolderKanban,
  Megaphone,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

// Global date-range presets
const PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "month", label: "This Month" },
  { key: "all", label: "All Time" },
  { key: "custom", label: "Custom" },
];

function resolveRange(preset, customFrom, customTo) {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: now };
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    case "month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    case "custom":
      return {
        from: customFrom ? startOfDay(new Date(customFrom)) : null,
        to: customTo ? endOfDay(new Date(customTo)) : null,
      };
    default:
      return { from: null, to: null };
  }
}

const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function DashboardPage() {
  const [preset, setPreset] = useState("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const range = useMemo(
    () => resolveRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );

  const fromISO = range.from ? range.from.toISOString() : "";
  const toISO = range.to ? range.to.toISOString() : "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (fromISO) qs.set("from", fromISO);
      if (toISO) qs.set("to", toISO);
      const res = await fetch(`/api/analytics?${qs.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to load analytics", e);
    } finally {
      setLoading(false);
    }
  }, [fromISO, toISO]);

  useEffect(() => {
    // Wait until both custom dates are chosen before querying.
    if (preset === "custom" && (!customFrom || !customTo)) return;
    load();
  }, [load, preset, customFrom, customTo]);

  const kpis = [
    {
      label: "Total Raised",
      value: inr(data?.totals?.raised),
      icon: <IndianRupee size={18} />,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Donations",
      value: data?.totals?.donations ?? 0,
      icon: <Handshake size={18} />,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Unique Donors",
      value: data?.totals?.donors ?? 0,
      icon: <Users size={18} />,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Avg Donation",
      value: inr(data?.totals?.avg),
      icon: <TrendingUp size={18} />,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  const trend = {
    labels: (data?.timeseries || []).map((p) =>
      new Date(p.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Raised",
        data: (data?.timeseries || []).map((p) => p.amount),
        borderColor: "#059669",
        backgroundColor: "rgba(5,150,105,0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const typeChart = {
    labels: (data?.byType || []).map((t) => t.type),
    datasets: [
      {
        data: (data?.byType || []).map((t) => t.amount),
        backgroundColor: [
          "#059669",
          "#2563eb",
          "#d97706",
          "#7c3aed",
          "#64748b",
        ],
        borderWidth: 0,
      },
    ],
  };

  const hasData = (data?.totals?.donations || 0) > 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Donation performance across all projects.
          </p>
        </div>
        <button onClick={load} className="btn btn-ghost">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Global date filter — everything below responds to this */}
      <div className="admin-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CalendarDays size={16} className="text-emerald-600" />
            Date range
          </span>
          <div className="flex flex-wrap gap-1 rounded-full bg-[#f1f2f4] p-1">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  preset === p.key
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-sm"
              />
              <span className="text-gray-400">→</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          <span className="chip ml-auto text-gray-500">
            <CalendarDays size={14} className="text-gray-400" />
            {range.from
              ? `${range.from.toLocaleDateString("en-IN")} – ${(
                  range.to || new Date()
                ).toLocaleDateString("en-IN")}`
              : "All time"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="admin-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-gray-500">
                    {k.label}
                  </span>
                  <span className={`rounded-xl p-2.5 ${k.tone}`}>{k.icon}</span>
                </div>
                <p className="mt-4 text-[28px] font-extrabold leading-none tracking-tight text-gray-900">
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {/* Trend + type split */}
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="admin-card p-6 lg:col-span-2">
              <h2 className="mb-4 text-base font-bold text-gray-900">
                Donations over time
              </h2>
              {hasData ? (
                <div className="h-64">
                  <Line
                    data={trend}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, grid: { color: "#f2f4f7" } },
                        x: { grid: { display: false } },
                      },
                    }}
                  />
                </div>
              ) : (
                <EmptyState text="No donations in this period." />
              )}
            </div>

            <div className="admin-card p-6">
              <h2 className="mb-4 text-base font-bold text-gray-900">
                By donation type
              </h2>
              {hasData ? (
                <div className="h-64">
                  <Doughnut
                    data={typeChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "62%",
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { boxWidth: 10, usePointStyle: true },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <EmptyState text="No data." />
              )}
            </div>
          </div>

          {/* Project-level donation stats */}
          <div className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#eceef1] px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <FolderKanban size={17} className="text-emerald-600" />
                Donations by project
              </h2>
              <span className="badge badge-muted">
                {data?.byProject?.length || 0} projects
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th className="text-right">Donations</th>
                    <th className="text-right">Donors</th>
                    <th className="text-right">Raised</th>
                    <th className="w-48">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.byProject || []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-gray-400"
                      >
                        No donations in this period.
                      </td>
                    </tr>
                  ) : (
                    data.byProject.map((p) => {
                      const pct = p.totalRequired
                        ? Math.min(
                            100,
                            Math.round((p.amount / p.totalRequired) * 100)
                          )
                        : null;
                      return (
                        <tr key={p.projectId}>
                          <td className="font-medium">{p.title}</td>
                          <td className="text-right">{p.donations}</td>
                          <td className="text-right">{p.donors}</td>
                          <td className="text-right font-semibold text-emerald-700">
                            {inr(p.amount)}
                          </td>
                          <td>
                            {pct === null ? (
                              <span className="text-xs text-gray-400">
                                No target
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="w-9 text-right text-xs text-gray-500">
                                  {pct}%
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Influencers + recent */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="admin-card overflow-hidden">
              <div className="border-b border-[#eceef1] px-6 py-4">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <Megaphone size={17} className="text-emerald-600" />
                  Top influencers
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Influencer</th>
                      <th className="text-right">Donations</th>
                      <th className="text-right">Raised</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.byInfluencer || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-8 text-center text-gray-400"
                        >
                          No influencer-attributed donations yet.
                        </td>
                      </tr>
                    ) : (
                      data.byInfluencer.map((i) => (
                        <tr key={i.name}>
                          <td>
                            <span className="badge badge-success">
                              {i.name}
                            </span>
                          </td>
                          <td className="text-right">{i.donations}</td>
                          <td className="text-right font-semibold text-emerald-700">
                            {inr(i.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card overflow-hidden">
              <div className="border-b border-[#eceef1] px-6 py-4">
                <h2 className="text-base font-bold text-gray-900">
                  Recent donations
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Type</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.recent || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-gray-400"
                        >
                          Nothing yet.
                        </td>
                      </tr>
                    ) : (
                      data.recent.map((d) => (
                        <tr key={d._id}>
                          <td className="max-w-[160px] truncate font-medium">
                            {d.name || "Anonymous"}
                          </td>
                          <td className="text-gray-600">{d.donationType}</td>
                          <td className="text-right font-semibold text-emerald-700">
                            {inr(d.amount)}
                          </td>
                          <td className="text-right text-xs text-gray-500">
                            {d.createdAt
                              ? new Date(d.createdAt).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="grid gap-5 sm:grid-cols-3">
            <MiniStat
              label="Active projects"
              value={data?.projects?.active ?? 0}
            />
            <MiniStat
              label="Completed projects"
              value={data?.projects?.completed ?? 0}
            />
            <MiniStat
              label="Registered donors (all time)"
              value={data?.donorsAllTime ?? 0}
            />
          </div>
        </>
      )}
    </div>
  );
}

const EmptyState = ({ text }) => (
  <div className="flex h-64 items-center justify-center text-sm text-gray-400">
    {text}
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="admin-card flex items-center justify-between p-4">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-lg font-bold text-gray-900">{value}</span>
  </div>
);
