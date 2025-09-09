"use client";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useSession } from "next-auth/react";

export default function AboutStorySectionEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/aboutstorysection")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setForm(d || {});
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleArrayChange(section, idx, field, value) {
    setForm((f) => {
      const items = [...(f[section] || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, [section]: items };
    });
  }

  function handleAddItem(section) {
    setForm((f) => ({
      ...f,
      [section]: [...(f[section] || []), { title: "", content: "" }],
    }));
  }

  function handleRemoveItem(section, idx) {
    setForm((f) => ({
      ...f,
      [section]: f[section]?.filter((_, i) => i !== idx) || [],
    }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/aboutstorysection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lastUpdatedBy: userEmail }),
    });
    const updated = await res.json();
    setData(updated);
    setForm(updated);
    setEdit(false);
    setSaving(false);
  }

  if (loading) return <div className="mt-10">Loading...</div>;

  if (!data && !edit)
    return (
      <div>
        <p>No Story section found.</p>
        <button className="btn" onClick={() => setEdit(true)}>
          Create
        </button>
      </div>
    );

  const renderArrayEditor = (label, section) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 mb-2 items-center justify-between">
        <label className="text-base ms:text-xl font-semibold">{label}</label>
        <button
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-4 ms:px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
          onClick={() => handleAddItem(section)}
          type="button"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {(form[section] || []).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 border-2 border-violet-300 p-4 rounded-xl bg-violet-50"
          >
            <input
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) =>
                handleArrayChange(section, idx, "title", e.target.value)
              }
              className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
            />
            <textarea
              placeholder="Content"
              value={item.content || ""}
              onChange={(e) =>
                handleArrayChange(section, idx, "content", e.target.value)
              }
              className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
              rows={3}
            />
            <button
              className="btn btn-sm btn-error self-end text-red-500 cursor-pointer hover:bg-red-100 rounded-full p-2.5"
              onClick={() => handleRemoveItem(section, idx)}
              type="button"
            >
              <TbTrash className="text-xl" />
            </button>
          </div>
        ))}
      </div>
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

          <hr className="text-gray-300 my-8" />

          {renderArrayEditor("Journey", "journey")}
          {renderArrayEditor("Impact", "impact")}
          {renderArrayEditor("Future", "future")}

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
        </div>
      ) : (
        <div className="px-2 mt-6 space-y-6">
          <button
            className="absolute text-sm sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
            onClick={() => setEdit(true)}
          >
            Edit Section
          </button>

          <div>
            <span className="text-base ms:text-xl font-semibold">Title:</span>
            <span className="block mt-2 text-base sm:text-lg">
              {data.title}
            </span>
          </div>

          <div>
            <span className="text-base ms:text-xl font-semibold">
              Subtitle:
            </span>
            <span className="block mt-2">{data.subtitle}</span>
          </div>

          <hr className="text-gray-300 my-8" />

          {["journey", "impact", "future"].map((section) => (
            <div key={section} className="space-y-4">
              <span className="text-base ms:text-xl font-semibold block">
                {section.charAt(0).toUpperCase() + section.slice(1)}:
              </span>
              {data[section] && data[section].length > 0 ? (
                data[section].map((item, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-violet-300 p-4 rounded-xl bg-violet-50 flex flex-col gap-2"
                  >
                    <div className="font-semibold text-base text-gray-800">
                      {item.title || "No Title"}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {item.content || "No Content"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Section is empty</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
