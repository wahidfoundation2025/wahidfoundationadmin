"use client"
import { useEffect, useState } from "react"
import { Calendar, Users, Heart } from "lucide-react"
import { TbEdit, TbTrash } from "react-icons/tb";

const ICON_MAP = {
  Calendar: <Calendar size={24} className="inline-block align-middle mr-1" />,
  Users: <Users size={24} className="inline-block align-middle mr-1" />,
  Heart: <Heart size={24} className="inline-block align-middle mr-1" />,
}

export default function HomeHeroSectionEditor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/homeherosection")
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

  function handleStatsChange(e) {
    const { name, value } = e.target
    const [statKey, field] = name.split(".")
    setForm((f) => ({
      ...f,
      stats: {
        ...f.stats,
        [statKey]: {
          ...((f.stats && f.stats[statKey]) || {}),
          [field]: value,
        },
      },
    }))
  }

  function handleCardChange(idx, field, value) {
    setForm((f) => ({
      ...f,
      cards: f.cards?.map((c, i) => i === idx ? { ...c, [field]: value } : c) || [],
    }))
  }

  function handleAddCard() {
    setForm((f) => ({
      ...f,
      cards: [...(f.cards || []), { icon: '', title: '', description: '', themeColor: 'emerald' }],
    }))
  }

  function handleRemoveCard(idx) {
    setForm((f) => ({
      ...f,
      cards: f.cards?.filter((_, i) => i !== idx) || [],
    }))
  }

  function handleSecondaryCTAChange(e) {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      secondaryCTA: {
        ...f.secondaryCTA,
        [name]: value,
      },
    }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/homeherosection", {
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
      <p>No hero section found.</p>
      <button className="btn" onClick={() => setEdit(true)}>Create</button>
    </div>
  )

  return (
    <>
      {edit ? (
        <div className="space-y-6 mt-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input name="title" value={form.title || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Subtitle</label>
            <input name="subtitle" value={form.subtitle || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block font-semibold mb-1">CTA Text</label>
            <input name="ctaText" value={form.ctaText || ""} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Stats</label>
            <div className="flex gap-4 mb-2">
              <div className="flex-1">
                <label className="text-xs">Per Day Label</label>
                <input name="perDay.label" value={form.stats?.perDay?.label || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1 mb-1" />
                <label className="text-xs">Per Day Value</label>
                <input name="perDay.value" value={form.stats?.perDay?.value || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1" />
              </div>
              <div className="flex-1">
                <label className="text-xs">Lives Changed Label</label>
                <input name="livesChanged.label" value={form.stats?.livesChanged?.label || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1 mb-1" />
                <label className="text-xs">Lives Changed Value</label>
                <input name="livesChanged.value" value={form.stats?.livesChanged?.value || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1" />
              </div>
              <div className="flex-1">
                <label className="text-xs">States Label</label>
                <input name="states.label" value={form.stats?.states?.label || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1 mb-1" />
                <label className="text-xs">States Value</label>
                <input name="states.value" value={form.stats?.states?.value || ''} onChange={handleStatsChange} className="w-full border border-gray-300 rounded px-2 py-1" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-row gap-2 items-center justify-between w-full">
              <label className="block text-xl font-semibold mb-4">Cards</label>
              <button
                className="flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
                onClick={handleAddCard} type="button"
              >
                Add Card
              </button>
            </div>

            <div className="flex gap-2 max-w-full overflow-x-auto">
              {(form.cards || []).map((card, idx) => (
                <div key={idx} className="flex min-w-[250px] max-w-[300px] flex-col gap-4 items-center border border-gray-200 p-4 mb-3 rounded-xl bg-gray-50">
                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <select
                      value={card.icon || ''}
                      onChange={e => handleCardChange(idx, 'icon', e.target.value)}
                      className="border border-gray-300 flex-1 rounded-lg px-3 py-2 w-28 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Icon</option>
                      <option value="Calendar">📅 Calendar</option>
                      <option value="Users">👥 Users</option>
                      <option value="Heart">❤️ Heart</option>
                    </select>

                    {ICON_MAP[card.icon] && <span>{ICON_MAP[card.icon]}</span>}
                  </div>

                  <input placeholder="Title"
                    value={card.title || ''}
                    onChange={e => handleCardChange(idx, 'title', e.target.value)}
                    className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
                  />
                  <input placeholder="Description"
                    value={card.description || ''}
                    onChange={e => handleCardChange(idx, 'description', e.target.value)}
                    className="border border-gray-300 rounded-lg bg-white px-3 py-2 w-full"
                  />

                  <div className="flex flex-row gap-2 items-center justify-between w-full">
                    <input type="color" value={card.themeColor?.startsWith('#') ? card.themeColor : '#10b981'} onChange={e => handleCardChange(idx, 'themeColor', e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent" title="Pick color" />

                    <button
                      className="btn btn-sm btn-error ml-2 text-red-500 cursor-pointer hover:bg-red-100 rounded-full p-2.5"
                      onClick={() => handleRemoveCard(idx)} type="button"
                    >
                      <TbTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Secondary CTA</label>
            <input name="text" value={form.secondaryCTA?.text || ''} onChange={handleSecondaryCTAChange} className="w-full border border-gray-300 rounded px-3 py-2 mb-1" placeholder="Text" />
            <input name="link" value={form.secondaryCTA?.link || ''} onChange={handleSecondaryCTAChange} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Link" />
          </div>

          <div className="flex gap-2 absolute right-6 top-6">
            <button
              className="flex flex-row gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-500 px-6 py-2 cursor-pointer text-white  transition rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={() => { setEdit(false); setForm(data) }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 px-2 mt-4">
          <button className="absolute right-6 top-6 flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-500 px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl" onClick={() => setEdit(true)}>
            Edit Hero <TbEdit className="text-xl" />
          </button>

          <div className="mb-4">
            <span className="block font-semibold mb-1">Title:</span>
            <span className="block text-lg">{data.title}</span>
          </div>

          <div className="mb-4">
            <span className="block font-semibold mb-1">Subtitle:</span>
            <span className="block">{data.subtitle}</span>
          </div>

          <div className="mb-4">
            <span className="block font-semibold mb-1">CTA Text:</span>
            <span className="block">{data.ctaText}</span>
          </div>

          <div className="mb-4">
            <span className="block font-semibold mb-1">Stats:</span>
            {data.stats && (
              <div className="flex gap-6 mt-1">
                <div className="bg-white border rounded px-3 py-1"><span className="font-semibold">{data.stats.perDay?.label}:</span> {data.stats.perDay?.value}</div>
                <div className="bg-white border rounded px-3 py-1"><span className="font-semibold">{data.stats.livesChanged?.label}:</span> {data.stats.livesChanged?.value}</div>
                <div className="bg-white border rounded px-3 py-1"><span className="font-semibold">{data.stats.states?.label}:</span> {data.stats.states?.value}</div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <span className="block font-semibold mb-1">Cards:</span>
            <ul className="space-y-2">
              {(data.cards || []).map((card, idx) => {
                const Icon = ICON_MAP[card.icon] || null
                return (
                  <li key={idx} className="flex items-center gap-3 border rounded px-3 py-2 bg-white">
                    {Icon ? Icon : <span className="font-semibold">{card.icon}</span>}
                    <span className="font-semibold">{card.title}</span>
                    <span className="text-gray-700">{card.description}</span>
                    <span className="italic flex items-center gap-1">
                      <span
                        className="inline-block w-4 h-4 rounded-full border border-gray-300 align-middle"
                        style={{ background: card.themeColor?.startsWith('#') ? card.themeColor : undefined, backgroundColor: card.themeColor?.startsWith('#') ? card.themeColor : undefined }}
                      ></span>
                      {card.themeColor}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="mb-4">
            <span className="block font-semibold mb-1">Secondary CTA:</span>
            <span className="block">{data.secondaryCTA?.text} <span className="text-blue-600">({data.secondaryCTA?.link})</span></span>
          </div>
        </div>
      )}
    </>
  )
}
