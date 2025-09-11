"use client";
import { useEffect, useState } from "react";
import { Calendar, Users, Heart } from "lucide-react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useSession } from "next-auth/react";
import InfoRow from "@/app/components/InfoRow";

const ICON_MAP = {
  Calendar: <Calendar size={24} className="inline-block align-middle mr-1" />,
  Users: <Users size={24} className="inline-block align-middle mr-1" />,
  Heart: <Heart size={24} className="inline-block align-middle mr-1" />,
};

export default function AboutHeroSectionEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [rawSchema, setRawSchema] = useState({});

  useEffect(() => {
    fetch("/api/aboutherosection")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setForm(d || {});
        setRawSchema(
          d?.schemaMarkup ? JSON.stringify(d.schemaMarkup, null, 2) : "{}"
        );
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleStatsChange(e) {
    const { name, value } = e.target;
    const [statKey, field] = name.split(".");
    setForm((f) => ({
      ...f,
      stats: {
        ...f.stats,
        [statKey]: {
          ...((f.stats && f.stats[statKey]) || {}),
          [field]: value,
        },
      },
    }));
  }

  function handleSecondaryCTAChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      secondaryCTA: {
        ...f.secondaryCTA,
        [name]: value,
      },
    }));
  }

  function handleOgChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      og: {
        ...f.og,
        [name]: value,
      },
    }));
  }

  function handleKeywordKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !(form.target_keywords || []).includes(value)) {
        setForm((f) => ({
          ...f,
          target_keywords: [...(f.target_keywords || []), value],
        }));
        e.target.value = "";
      }
    }
  }

  function removeKeyword(idx) {
    setForm((f) => ({
      ...f,
      target_keywords: f.target_keywords?.filter((_, i) => i !== idx) || [],
    }));
  }

  // schema change handler
  const handleSchemaChange = (e) => {
    const value = e.target.value;
    setRawSchema(value);

    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        setForm((f) => ({ ...f, schemaMarkup: parsed }));
      }
    } catch {
      // ignore while typing invalid JSON
    }
  };

  async function handleSave() {
    setSaving(true);

    let schemaToSave = {};
    try {
      const parsed = JSON.parse(rawSchema);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        schemaToSave = parsed;
      }
    } catch {}

    const res = await fetch("/api/aboutherosection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        schemaMarkup: schemaToSave,
        lastUpdatedBy: userEmail,
      }),
    });

    const updated = await res.json();
    setData(updated);
    setForm(updated);
    setRawSchema(
      updated?.schemaMarkup
        ? JSON.stringify(updated.schemaMarkup, null, 2)
        : "{}"
    );
    setEdit(false);
    setSaving(false);
  }

  if (loading) return <div className="mt-10">Loading...</div>;

  if (!data && !edit)
    return (
      <div>
        <p>No hero section found.</p>
        <button className="btn" onClick={() => setEdit(true)}>
          Create
        </button>
      </div>
    );

  return (
    <>
      {edit ? (
        <div className="space-y-6 mt-6 px-2">
          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">Title</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">
              Subtitle
            </label>
            <input
              name="subtitle"
              value={form.subtitle || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">
              CTA Text
            </label>
            <input
              name="ctaText"
              value={form.ctaText || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">
              Secondary CTA section Title
            </label>
            <input
              name="secondaryCTATitle"
              value={form.secondaryCTATitle || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">
              Secondary CTA section Subtitle
            </label>
            <input
              name="secondaryCTASubtitle"
              value={form.secondaryCTASubtitle || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <>
            <label className="text-base ms:text-xl font-semibold">
              Secondary CTA
            </label>

            <div className="flex sm:flex-row flex-col mt-4 gap-1 sm:gap-4">
              <input
                name="text"
                value={form.secondaryCTA?.text || ""}
                onChange={handleSecondaryCTAChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="Text"
              />
              <input
                name="link"
                value={form.secondaryCTA?.link || ""}
                onChange={handleSecondaryCTAChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
                placeholder="Link"
              />
            </div>
          </>

          <hr className="text-gray-300 my-8" />

          <>
            <label className="text-base ms:text-xl font-semibold">Stats</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2 mt-4">
              <div className="flex flex-col gap-2">
                <label>Years of Impact Label</label>
                <input
                  name="yearsOfImpact.label"
                  value={form.stats?.yearsOfImpact?.label || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Years of Impact Value</label>
                <input
                  name="yearsOfImpact.value"
                  value={form.stats?.yearsOfImpact?.value || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Lives Changed Label</label>
                <input
                  name="livesChanged.label"
                  value={form.stats?.livesChanged?.label || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Lives Changed Value</label>
                <input
                  name="livesChanged.value"
                  value={form.stats?.livesChanged?.value || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>States Label</label>
                <input
                  name="states.label"
                  value={form.stats?.states?.label || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>States Value</label>
                <input
                  name="states.value"
                  value={form.stats?.states?.value || ""}
                  onChange={handleStatsChange}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </>

          <div className="flex gap-2 absolute right-3 sm:right-6 top-3 sm:top-6">
            <button
              className="flex flex-row sm:text-base text-sm gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-white  transition rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="flex flex-row sm:text-base text-sm gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={() => {
                setEdit(false);
                setForm(data);
              }}
            >
              Cancel
            </button>
          </div>

          <hr className="text-gray-300 my-8" />

          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">SEO Tags</h2>

            {/* Meta Title */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold">Meta Title</label>
              <input
                name="metatitle"
                value={form.metatitle || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold">
                Meta Description
              </label>
              <textarea
                name="metadescription"
                value={form.metadescription || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
                rows={3}
              />
            </div>

            {/* Open Graph Fields */}
            <div className="space-y-3">
              <label className="text-base font-semibold">Open Graph (OG)</label>
              <input
                name="title"
                value={form.og?.title || ""}
                onChange={handleOgChange}
                placeholder="OG Title"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
              />
              <input
                name="description"
                value={form.og?.description || ""}
                onChange={handleOgChange}
                placeholder="OG Description"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
              />
              <input
                name="url"
                value={form.og?.url || ""}
                onChange={handleOgChange}
                placeholder="OG URL"
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
              />
            </div>

            {/* Target Keywords */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-semibold">Target Keywords</label>
              <input
                type="text"
                placeholder="Type a keyword and press Enter or ,"
                onKeyDown={handleKeywordKeyDown}
                className="w-full border border-gray-300 rounded-xl px-3 py-2"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.target_keywords || []).map((kw, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(idx)}
                      className="text-violet-500 hover:text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm">
              <label className="font-medium block mb-1">
                Schema Markup (JSON-LD)
              </label>
              <textarea
                name="schemaMarkup"
                className="border p-2 w-full rounded-xl border-gray-300 font-mono"
                placeholder='{"name": "Name of Schema", "description": "Description for Schema", "link": "https://"}'
                value={rawSchema}
                onChange={handleSchemaChange}
                rows={6}
              />
            </div>
            <p className="text-sm p-3 font-mono rounded-xl bg-purple-100 border border-gray-300 whitespace-pre-wrap">
              {rawSchema || "No Schema Added"}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-2 mt-6 space-y-6">
          <button
            className="absolute text-sm sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
            onClick={() => setEdit(true)}
          >
            Edit Hero <TbEdit className="text-xl" />
          </button>

          <>
            <span className="text-base ms:text-xl font-semibold">Title:</span>
            <span className="block mt-2 text-base sm:text-lg">
              {data.title}
            </span>
          </>

          <>
            <span className="text-base ms:text-xl font-semibold">
              Subtitle:
            </span>
            <span className="block mt-2">{data.subtitle}</span>
          </>

          <>
            <span className="text-base ms:text-xl font-semibold">
              CTA Text:
            </span>
            <span className="block mt-2">{data.ctaText}</span>
          </>

          <>
            <span className="text-base ms:text-xl font-semibold">
              Secondary CTA section Title:
            </span>
            <span className="block mt-2">{data.secondaryCTATitle}</span>
          </>

          <>
            <span className="text-base ms:text-xl font-semibold">
              Secondary CTA section Subtitle:
            </span>
            <span className="block mt-2">{data.secondaryCTASubtitle}</span>
          </>

          <>
            <span className="text-base ms:text-xl font-semibold">
              Secondary CTA button Text:
            </span>
            <span className="block mt-2">
              {data.secondaryCTA?.text}{" "}
              <span className="text-violet-600">
                ({data.secondaryCTA?.link})
              </span>
            </span>
          </>

          <hr className="text-gray-300 my-8" />

          <>
            <span className="text-base ms:text-xl font-semibold">Stats:</span>

            <div className="flex sm:gap-6 gap-2 mt-4 flex-wrap">
              {data.stats && (
                <>
                  <div className="border-2 border-violet-300 bg-violet-50 rounded-lg px-3 py-1.5 sm:py-2">
                    <span className="font-semibold text-sm sm:text-base">
                      {data.stats.yearsOfImpact?.label}
                      {": "}
                    </span>
                    {data.stats.yearsOfImpact?.value}
                  </div>
                  <div className="border-2 border-violet-300 bg-violet-50 rounded-lg px-3 py-1.5 sm:py-2">
                    <span className="font-semibold text-sm sm:text-base">
                      {data.stats.livesChanged?.label}
                      {": "}
                    </span>
                    {data.stats.livesChanged?.value}
                  </div>
                  <div className="border-2 border-violet-300 bg-violet-50 rounded-lg px-3 py-1.5 sm:py-2">
                    <span className="font-semibold text-sm sm:text-base">
                      {data.stats.states?.label}
                      {": "}
                    </span>
                    {data.stats.states?.value}
                  </div>
                </>
              )}
            </div>
          </>

          <hr className="text-gray-300 my-8" />

          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">SEO Tags</h2>

            {/* Meta Title */}
            <div>
              <p className="text-sm sm:text-base font-semibold">Meta Title</p>
              <p className="text-sm sm:text-base text-gray-700">
                {data.metatitle || <span className="text-gray-400">N/A</span>}
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <p className="text-sm sm:text-base font-semibold">
                Meta Description
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                {data.metadescription || (
                  <span className="text-gray-400">N/A</span>
                )}
              </p>
            </div>

            {/* Target Keywords */}
            <div>
              <p className="text-sm sm:text-base font-semibold mb-1">
                Target Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.target_keywords || []).length > 0 ? (
                  data.target_keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm sm:text-base">
                    N/A
                  </span>
                )}
              </div>
            </div>

            {/* OG Section */}
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-semibold">
                Open Graph (OG)
              </p>

              <div className="flex gap-2 items-center">
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  OG Title
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  {data.og?.title || <span className="text-gray-400">N/A</span>}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  OG Description
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  {data.og?.description || (
                    <span className="text-gray-400">N/A</span>
                  )}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <p className="text-xs sm:text-sm font-bold text-gray-600">
                  OG URL
                </p>
                <p className="text-sm sm:text-base text-gray-700 break-all">
                  {data.og?.url || <span className="text-gray-400">N/A</span>}
                </p>
              </div>
            </div>

            <hr className="text-gray-300 my-8" />

            <h2 className="text-lg sm:text-xl font-semibold">Schema Markup</h2>
            <div>
              {data.schemaMarkup ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-2">
                  <h3 className="text-lg font-semibold">
                    {data.schemaMarkup.name}
                  </h3>
                  <InfoRow
                    label="Description"
                    value={data.schemaMarkup.description || "N/A"}
                  />
                  <InfoRow
                    label="Link"
                    value={
                      data.schemaMarkup.link ? (
                        <a
                          href={data.schemaMarkup.link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {data.schemaMarkup.link}
                        </a>
                      ) : (
                        "N/A"
                      )
                    }
                  />
                </div>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
