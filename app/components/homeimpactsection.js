"use client"
import { useEffect, useState } from "react"
import { Calendar, Users, Heart, GraduationCap, Building2 } from "lucide-react"

const ICON_MAP = {
  Calendar: <Calendar size={16} className="inline-block align-middle mr-1" />,
  Users: <Users size={16} className="inline-block align-middle mr-1" />,
  Heart: <Heart size={16} className="inline-block align-middle mr-1" />,
  GraduationCap: <GraduationCap size={16} className="inline-block align-middle mr-1" />,
  Building: <Building2 size={16} className="inline-block align-middle mr-1" />,
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

  if (loading) return <div>Loading...</div>

  if (!data && !edit) return (
    <div>
      <p>No impact section found.</p>
      <button className="btn" onClick={() => setEdit(true)}>Create</button>
    </div>
  )

  return (
    <div className="bg-white p-6 rounded shadow text-black min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Impact Section Editor</h2>
      {edit ? (
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input name="title" value={form.title || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Subtitle</label>
            <input name="subtitle" value={form.subtitle || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Stats</label>
            {(form.stats || []).map((stat, idx) => (
              <div key={idx} className="border p-3 mb-3 rounded bg-gray-50 flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <select
                    value={stat.icon || ''}
                    onChange={e => handleStatChange(idx, 'icon', e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-28 bg-white"
                  >
                    <option value="">Select Icon</option>
                    <option value="Calendar">📅 Calendar</option>
                    <option value="Users">👥 Users</option>
                    <option value="Heart">❤️ Heart</option>
                    <option value="GraduationCap">🎓 GraduationCap</option>
                    <option value="Building">🏢 Building</option>
                  </select>
                  {ICON_MAP[stat.icon] && <span>{ICON_MAP[stat.icon]}</span>}
                  <input placeholder="Title" value={stat.title || ''} onChange={e => handleStatChange(idx, 'title', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-32" />
                  <input placeholder="Value" value={stat.value || ''} onChange={e => handleStatChange(idx, 'value', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-24" />
                  <input placeholder="Description" value={stat.description || ''} onChange={e => handleStatChange(idx, 'description', e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-48" />
                  <input type="color" value={stat.color?.startsWith('#') ? stat.color : '#10b981'} onChange={e => handleStatChange(idx, 'color', e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" title="Pick color" />
                  <button className="btn btn-sm btn-error ml-2" onClick={() => handleRemoveStat(idx)} type="button">Remove</button>
                </div>
              </div>
            ))}
            <button className="btn btn-sm btn-primary mt-2" onClick={handleAddStat} type="button">Add Stat</button>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            <button className="btn ml-2" onClick={() => { setEdit(false); setForm(data) }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <span className="block font-semibold mb-1">Title:</span>
            <span className="block text-lg">{data.title}</span>
          </div>
          <div className="mb-4">
            <span className="block font-semibold mb-1">Subtitle:</span>
            <span className="block">{data.subtitle}</span>
          </div>
          <div className="mb-4">
            <span className="block font-semibold mb-1">Stats:</span>
            <ul className="space-y-2">
              {(data.stats || []).map((stat, idx) => {
                const Icon = ICON_MAP[stat.icon] || null
                return (
                  <li key={idx} className="flex items-center gap-3 border rounded px-3 py-2 bg-white">
                    {Icon ? Icon : <span className="font-semibold">{stat.icon}</span>}
                    <span className="font-semibold">{stat.title}</span>
                    <span className="text-blue-700">{stat.value}</span>
                    <span className="text-gray-700">{stat.description}</span>
                    <span className="italic flex items-center gap-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle"
                        style={{ background: stat.color?.startsWith('#') ? stat.color : undefined, backgroundColor: stat.color?.startsWith('#') ? stat.color : undefined }}
                      ></span>
                      {stat.color}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <button className="btn btn-primary mt-4" onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  )
}
