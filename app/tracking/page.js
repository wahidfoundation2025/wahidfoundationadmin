"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  RefreshCw,
} from "lucide-react";

const emptyScript = () => ({
  name: "",
  enabled: true,
  placement: "head",
  type: "inline",
  strategy: "afterInteractive",
  src: "",
  code: "",
  pageScope: "all",
  pages: [],
});

// Pages a script can be targeted to (paths on the public site).
// "@payment-success" is a special event target: fires when the donation
// Thank-You / payment-confirmation popup appears (for conversion pixels).
const PAGES = [
  { value: "/", label: "Home" },
  { value: "/projects", label: "Projects" },
  { value: "/impact", label: "Our Impact" },
  { value: "/about", label: "About" },
  { value: "/volunteer", label: "Volunteer" },
  { value: "/blogs", label: "Blogs" },
  { value: "/donate", label: "Donate" },
  { value: "/profile", label: "Profile" },
  { value: "@payment-success", label: "Payment confirmation (Thank You popup)" },
];

const PLACEMENTS = [
  { value: "head", label: "<head>" },
  { value: "body-start", label: "Start of <body>" },
  { value: "body-end", label: "End of <body>" },
];
const TYPES = [
  { value: "external", label: "External (URL)" },
  { value: "inline", label: "Inline (raw code)" },
];
const STRATEGIES = [
  { value: "afterInteractive", label: "After interactive (default)" },
  { value: "beforeInteractive", label: "Before interactive" },
  { value: "lazyOnload", label: "Lazy on load" },
];

export default function TrackingPage() {
  const [settings, setSettings] = useState({
    ga4Id: "",
    gtmId: "",
    metaPixelId: "",
    customScripts: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tracking");
      const data = await res.json();
      setSettings({
        ga4Id: data.ga4Id || "",
        gtmId: data.gtmId || "",
        metaPixelId: data.metaPixelId || "",
        customScripts: Array.isArray(data.customScripts)
          ? data.customScripts
          : [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSettings({
        ga4Id: data.ga4Id || "",
        gtmId: data.gtmId || "",
        metaPixelId: data.metaPixelId || "",
        customScripts: data.customScripts || [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (k, v) => setSettings((s) => ({ ...s, [k]: v }));

  const updateScript = (i, patch) =>
    setSettings((s) => ({
      ...s,
      customScripts: s.customScripts.map((sc, idx) =>
        idx === i ? { ...sc, ...patch } : sc
      ),
    }));

  const addScript = () =>
    setSettings((s) => ({
      ...s,
      customScripts: [...s.customScripts, emptyScript()],
    }));

  const removeScript = (i) =>
    setSettings((s) => ({
      ...s,
      customScripts: s.customScripts.filter((_, idx) => idx !== i),
    }));

  const moveScript = (i, dir) =>
    setSettings((s) => {
      const arr = [...s.customScripts];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return s;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...s, customScripts: arr };
    });

  const inputCls =
    "w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200";
  const labelCls = "mb-1 block text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-full w-full rounded-2xl bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tracking Scripts</h1>
          <p className="mt-1 text-base text-gray-600">
            Manage Google Analytics, Meta Pixel, GTM, and any custom scripts
            injected into the site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-400">
          Loading…
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick setup */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Quick setup</h2>
            <p className="mb-5 text-sm text-gray-500">
              Paste only the IDs — we generate the correct snippets
              automatically.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelCls}>Google Analytics 4 ID</label>
                <input
                  className={inputCls}
                  placeholder="G-XXXXXXXXXX"
                  value={settings.ga4Id}
                  onChange={(e) => setField("ga4Id", e.target.value.trim())}
                />
              </div>
              <div>
                <label className={labelCls}>Google Tag Manager ID</label>
                <input
                  className={inputCls}
                  placeholder="GTM-XXXXXXX"
                  value={settings.gtmId}
                  onChange={(e) => setField("gtmId", e.target.value.trim())}
                />
              </div>
              <div>
                <label className={labelCls}>Meta (Facebook) Pixel ID</label>
                <input
                  className={inputCls}
                  placeholder="123456789012345"
                  value={settings.metaPixelId}
                  onChange={(e) =>
                    setField("metaPixelId", e.target.value.trim())
                  }
                />
              </div>
            </div>
          </div>

          {/* Custom scripts */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Custom scripts</h2>
                <p className="text-sm text-gray-500">
                  Add any other tracking pixels or scripts (LinkedIn Insight,
                  Hotjar, etc.).
                </p>
              </div>
              <button
                onClick={addScript}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <Plus size={16} /> Add Script
              </button>
            </div>

            {settings.customScripts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
                No custom scripts yet. Click “Add Script”.
              </div>
            ) : (
              <div className="space-y-5">
                {settings.customScripts.map((sc, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-200 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                          Script #{i + 1}
                        </span>
                        <label className="flex items-center gap-1.5 text-sm font-medium">
                          <input
                            type="checkbox"
                            checked={sc.enabled}
                            onChange={(e) =>
                              updateScript(i, { enabled: e.target.checked })
                            }
                            className="h-4 w-4 accent-violet-600"
                          />
                          Enabled
                        </label>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <button
                          onClick={() => moveScript(i, -1)}
                          className="rounded p-1.5 hover:bg-gray-100"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveScript(i, 1)}
                          className="rounded p-1.5 hover:bg-gray-100"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={() => removeScript(i)}
                          className="rounded p-1.5 text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelCls}>Name (for your reference)</label>
                        <input
                          className={inputCls}
                          placeholder="e.g. Hotjar, LinkedIn Insight"
                          value={sc.name}
                          onChange={(e) =>
                            updateScript(i, { name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Placement</label>
                        <select
                          className={inputCls}
                          value={sc.placement}
                          onChange={(e) =>
                            updateScript(i, { placement: e.target.value })
                          }
                        >
                          {PLACEMENTS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Type</label>
                        <select
                          className={inputCls}
                          value={sc.type}
                          onChange={(e) =>
                            updateScript(i, { type: e.target.value })
                          }
                        >
                          {TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Load strategy</label>
                        <select
                          className={inputCls}
                          value={sc.strategy}
                          onChange={(e) =>
                            updateScript(i, { strategy: e.target.value })
                          }
                        >
                          {STRATEGIES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Page targeting */}
                    <div className="mt-4">
                      <label className={labelCls}>Load on</label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`scope-${i}`}
                            checked={(sc.pageScope || "all") === "all"}
                            onChange={() =>
                              updateScript(i, { pageScope: "all" })
                            }
                            className="h-4 w-4 accent-violet-600"
                          />
                          All pages
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`scope-${i}`}
                            checked={sc.pageScope === "specific"}
                            onChange={() =>
                              updateScript(i, { pageScope: "specific" })
                            }
                            className="h-4 w-4 accent-violet-600"
                          />
                          Specific pages
                        </label>
                      </div>

                      {sc.pageScope === "specific" && (
                        <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-gray-200 p-3 sm:grid-cols-2 lg:grid-cols-3">
                          {PAGES.map((pg) => {
                            const selected = (sc.pages || []).includes(pg.value);
                            return (
                              <label
                                key={pg.value}
                                className="flex items-center gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => {
                                    const set = new Set(sc.pages || []);
                                    if (e.target.checked) set.add(pg.value);
                                    else set.delete(pg.value);
                                    updateScript(i, { pages: Array.from(set) });
                                  }}
                                  className="h-4 w-4 accent-violet-600"
                                />
                                {pg.label}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {sc.type === "external" ? (
                      <div className="mt-4">
                        <label className={labelCls}>Script URL (src)</label>
                        <input
                          className={inputCls}
                          placeholder="https://example.com/pixel.js"
                          value={sc.src}
                          onChange={(e) =>
                            updateScript(i, { src: e.target.value })
                          }
                        />
                      </div>
                    ) : (
                      <div className="mt-4">
                        <label className={labelCls}>Inline code</label>
                        <textarea
                          rows={5}
                          className={`${inputCls} font-mono`}
                          placeholder="// paste raw JS — do NOT wrap in <script> tags"
                          value={sc.code}
                          onChange={(e) =>
                            updateScript(i, { code: e.target.value })
                          }
                        />
                        <p className="mt-1 text-xs text-gray-400">
                          Paste only the JavaScript itself (no &lt;script&gt;
                          wrapper).
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
