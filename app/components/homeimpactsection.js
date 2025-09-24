"use client"
import { useEffect, useState } from "react"
import { Calendar, Users, Heart, GraduationCap, Building2 } from "lucide-react"
import { TbEdit, TbTrash } from "react-icons/tb"

const ICON_MAP = {
  Calendar: <Calendar size={24} className="inline-block align-middle mr-1" />,
  Users: <Users size={24} className="inline-block align-middle mr-1" />,
  Heart: <Heart size={24} className="inline-block align-middle mr-1" />,
  GraduationCap: <GraduationCap size={24} className="inline-block align-middle mr-1" />,
  Building: <Building2 size={24} className="inline-block align-middle mr-1" />,
}

export default function HomeImpactSectionEditor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/homeimpactsection")
      .then((res) => res.json())
      .then((d) => {
        setData(d)
        setForm(d || {})
        setLoading(false)
      })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleStatChange(idx, field, value) {
    setForm((f) => ({
      ...f,
      stats: f.stats?.map((s, i) => i === idx ? { ...s, [field]: value } : s) || [],
    }))
  }

  function handleAddStat() {
    setForm((f) => ({
      ...f,
      stats: [...(f.stats || []), { icon: '', title: '', value: '', description: '', color: '#10b981' }],
    }))
  }

  function handleRemoveStat(idx) {
    setForm((f) => ({
      ...f,
      stats: f.stats?.filter((_, i) => i !== idx) || [],
    }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/homeimpactsection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const updated = await res.json()
    setData(updated)
    setForm(updated)
    setEdit(false)
    setSaving(false)
  }

  if (loading) return <div className="mt-10">Loading...</div>

  if (!data && !edit) return (
    <div className="mt-6 px-2">
      <p>No impact section found.</p>
      <button className="btn" onClick={() => setEdit(true)}>Create</button>
    </div>
  )

  return (
    <>
      {edit ? (
        <div className="space-y-6 mt-6 px-2">
          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">Title</label>
            <input name="title" value={form.title || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base ms:text-xl font-semibold">Subtitle</label>
            <input name="subtitle" value={form.subtitle || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400" />
          </div>

          <hr className="text-gray-300 my-8" />

          <div className="flex flex-row gap-2 mb-4 items-center justify-between w-full">
            <label className="text-base ms:text-xl font-semibold">Impact Stats</label>
            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-4 sm:px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={handleAddStat} type="button"
            >
              Add Stat
            </button>
          </div>

          <div className="flex sm:flex-row flex-col gap-2 max-w-full overflow-x-auto">
            {(form.stats || []).map((stat, idx) => (
              <div key={idx} className="flex min-w-full sm:min-w-[300px] max-w-fit sm:max-w-[320px] flex-col gap-3 items-center border border-gray-200 p-4 rounded-xl bg-gray-50">
                <div className="flex items-center justify-between w-full gap-2">
                  <select
                    value={stat.icon || ''}
                    onChange={e => handleStatChange(idx, 'icon', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 bg-white"
                  >
                    <option value="">Select Icon</option>
                    <option value="Calendar">📅 Calendar</option>
                    <option value="Users">👥 Users</option>
                    <option value="Heart">❤️ Heart</option>
                    <option value="GraduationCap">🎓 GraduationCap</option>
                    <option value="Building">🏢 Building</option>
                  </select>

                  {ICON_MAP[stat.icon] && <span>{ICON_MAP[stat.icon]}</span>}
                </div>

                <input placeholder="Title" value={stat.title || ''} onChange={e => handleStatChange(idx, 'title', e.target.value)} className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2" />
                <input placeholder="Value" value={stat.value || ''} onChange={e => handleStatChange(idx, 'value', e.target.value)} className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2" />
                <input placeholder="Description" value={stat.description || ''} onChange={e => handleStatChange(idx, 'description', e.target.value)} className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2" />

                <div className="flex justify-between items-center w-full">
                  <input type="color" value={stat.color?.startsWith('#') ? stat.color : '#10b981'} onChange={e => handleStatChange(idx, 'color', e.target.value)} className="w-10 h-10 border-none bg-transparent" title="Pick color" />
                  <button className="text-red-500 hover:bg-red-100 p-2 rounded-full" onClick={() => handleRemoveStat(idx)} type="button">
                    <TbTrash className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 absolute right-3 sm:right-6 top-3 sm:top-6">
            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-600 px-4 ms:px-6 py-2 cursor-pointer text-white transition rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 px-4 ms:px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={() => { setEdit(false); setForm(data) }}
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
            Edit Impact
             <TbEdit className="text-xl" />
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-base ms:text-xl font-semibold">Title:</span>
            <span className="block text-base ms:text-sm">{data.title}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-base ms:text-xl font-semibold">Subtitle:</span>
            <span className="block">{data.subtitle}</span>
          </div>

          <hr className="text-gray-300 my-8" />

          <div>
            <span className="text-base ms:text-xl font-semibold block mb-4">Impact Stats:</span>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {(data.stats || []).map((stat, idx) => {
                const Icon = ICON_MAP[stat.icon] || null
                return (
                  <div key={idx} className="flex-shrink-0 min-w-full sm:min-w-[250px] max-w-full sm:max-w-[300px] border border-gray-200 p-4 rounded-xl bg-gray-50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">{stat.icon || "No Icon"}</div>
                      {Icon}
                    </div>

                    <div className="font-semibold text-base text-gray-800">
                      {stat.title || "No Title"}
                    </div>

                    <div className="text-violet-700 text-sm">{stat.value || "No Value"}</div>

                    <div className="text-gray-600 text-sm">{stat.description || "No Description"}</div>

                    <div className="flex justify-between items-center">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: stat.color?.startsWith('#') ? stat.color : '#10b981' }}
                      ></div>
                      <div className="text-sm italic text-gray-500">{stat.color || "#10b981"}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
