"use client";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { Users, Heart, Medal, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";

const ICON_MAP = {
  Users: <Users size={24} className="inline-block align-middle mr-1" />,
  Heart: <Heart size={24} className="inline-block align-middle mr-1" />,
  Medal: <Medal size={24} className="inline-block align-middle mr-1" />,
  Building2: <Building2 size={24} className="inline-block align-middle mr-1" />,
};

export default function AboutValuesSectionEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/aboutvaluesection")
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

  function handleCardChange(idx, field, value) {
    console.log(field, value);
    setForm((f) => {
      const cards = [...(f.cards || [])];
      cards[idx] = { ...cards[idx], [field]: value };
      return { ...f, cards };
    });
  }

  function handleAddCard() {
    setForm((f) => ({
      ...f,
      cards: [...(f.cards || []), { icon: "", title: "", description: "" }],
    }));
  }

  function handleRemoveCard(idx) {
    setForm((f) => ({
      ...f,
      cards: f.cards?.filter((_, i) => i !== idx) || [],
    }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/aboutvaluesection", {
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
        <p>No Values section found.</p>
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

          <hr className="text-gray-300 my-8" />

          <>
            <div className="flex flex-row gap-2 mb-4 items-center justify-between w-full">
              <label className="text-base ms:text-xl font-semibold">
                Cards
              </label>
              <button
                className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-4 ms:px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
                onClick={handleAddCard}
                type="button"
              >
                Add Card
              </button>
            </div>

            <div className="flex sm:flex-row flex-col gap-2 max-w-full sm:overflow-x-auto">
              {(form.cards || []).map((card, idx) => (
                <div
                  key={idx}
                  className="flex min-w-full sm:min-w-[250px] max-w-fit sm:max-w-[300px] flex-col gap-4 items-center border-2 border-violet-300 p-4 rounded-xl bg-violet-50"
                >
                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <select
                      value={card.icon || ""}
                      onChange={(e) =>
                        handleCardChange(idx, "icon", e.target.value)
                      }
                      className="border border-gray-300 flex-1 rounded-lg px-3 py-2 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Icon</option>
                      <option value="Medal">🏅 Medal</option>
                      <option value="Building2">🏢 Building</option>
                      <option value="Users">👥 Users</option>
                      <option value="Heart">❤️ Heart</option>
                    </select>

                    {ICON_MAP[card.icon] && <span>{ICON_MAP[card.icon]}</span>}
                  </div>

                  <input
                    placeholder="Title"
                    value={card.title || ""}
                    onChange={(e) =>
                      handleCardChange(idx, "title", e.target.value)
                    }
                    className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
                  />
                  <input
                    placeholder="Description"
                    value={card.description || ""}
                    onChange={(e) =>
                      handleCardChange(idx, "description", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg bg-white px-3 py-2 w-full"
                  />

                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <button
                      className="btn btn-sm btn-error ml-2 text-red-500 cursor-pointer hover:bg-red-100 rounded-full p-2.5"
                      onClick={() => handleRemoveCard(idx)}
                      type="button"
                    >
                      <TbTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
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
        </div>
      ) : (
        <div className="px-2 mt-6 space-y-6">
          <button
            className="absolute text-sm sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
            onClick={() => setEdit(true)}
          >
            Edit Section <TbEdit className="text-xl" />
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

          <hr className="text-gray-300 my-8" />

          <>
            <span className="text-base ms:text-xl font-semibold block mb-4">
              Cards:
            </span>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {(data.cards || []).map((card, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex-shrink-0 min-w-full sm:min-w-[250px] max-w-fit sm:max-w-[300px] border-2 border-violet-300 p-4 rounded-xl bg-violet-50 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {card.icon || "No Icon"}
                      </div>
                      {ICON_MAP[card.icon] ?? null}
                    </div>

                    <div className="font-semibold text-base text-gray-800">
                      {card.title || "No Title"}
                    </div>

                    <div className="text-gray-600 text-sm">
                      {card.description || "No Description"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      )}
    </>
  );
}
