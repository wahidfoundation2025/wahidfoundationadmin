"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Trash2, Plus, Link as LinkIcon } from "lucide-react";

// Public site base used to build shareable referral links.
const SITE_URL = "https://wahid.org.in";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/influencers");
      const data = await res.json();
      setInfluencers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const linkFor = (code) => `${SITE_URL}/?ref=${code}`;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to create influencer");
        return;
      }
      setForm({ name: "", email: "", phone: "", notes: "" });
      await load();
    } catch (e) {
      alert("Failed to create influencer");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async (inf) => {
    try {
      await navigator.clipboard.writeText(linkFor(inf.code));
      setCopiedId(inf._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const toggleActive = async (inf) => {
    await fetch(`/api/influencers/${inf._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !inf.active }),
    });
    load();
  };

  const remove = async (inf) => {
    if (!confirm(`Delete influencer "${inf.name}"? Existing donation records keep their attribution.`))
      return;
    await fetch(`/api/influencers/${inf._id}`, { method: "DELETE" });
    load();
  };

  const inr = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <div className="min-h-full w-full rounded-2xl bg-white p-6">
      <h1 className="mb-2 text-2xl font-bold">Influencers</h1>
      <p className="mb-6 text-base text-gray-600">
        Onboard influencers and share their unique referral link. Any donation
        made after visiting through that link is attributed to them.
      </p>

      {/* Create form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Influencer name *"
          required
          className="rounded-xl border border-gray-300 p-2.5 text-sm"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email (optional)"
          className="rounded-xl border border-gray-300 p-2.5 text-sm"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone (optional)"
          className="rounded-xl border border-gray-300 p-2.5 text-sm"
        />
        <input
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Notes (optional)"
          className="rounded-xl border border-gray-300 p-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus size={16} />
          {saving ? "Adding…" : "Add Influencer"}
        </button>
      </form>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="border-b border-gray-300 bg-gray-200 font-semibold text-gray-700">
            <tr>
              <th className="rounded-tl-xl px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Referral Link</th>
              <th className="px-4 py-3 font-medium">Donations</th>
              <th className="px-4 py-3 font-medium">Raised</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="rounded-tr-xl px-4 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : influencers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No influencers yet. Add one above.
                </td>
              </tr>
            ) : (
              influencers.map((inf) => (
                <tr
                  key={inf._id}
                  className="border-b border-gray-300 transition last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{inf.name}</div>
                    {inf.email && (
                      <div className="text-xs text-gray-500">{inf.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="max-w-[240px] truncate rounded-lg bg-gray-100 px-2 py-1 text-xs">
                        {linkFor(inf.code)}
                      </code>
                      <button
                        onClick={() => copyLink(inf)}
                        title="Copy link"
                        className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-100"
                      >
                        {copiedId === inf._id ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{inf.donations}</td>
                  <td className="px-4 py-3 font-semibold text-green-700">
                    {inr(inf.totalRaised)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(inf)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        inf.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {inf.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(inf)}
                      title="Delete"
                      className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
        <LinkIcon size={12} />
        Tip: influencers can append <code className="mx-1">?ref={"{code}"}</code>{" "}
        to any page link (e.g. a specific project) — attribution still works.
      </p>
    </div>
  );
}
