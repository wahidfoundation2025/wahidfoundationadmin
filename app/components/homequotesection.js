"use client"
import { useEffect, useState } from "react"
import { TbEdit, TbTrash } from "react-icons/tb"

export default function HomeQuoteSectionEditor() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ text: "", reference: "", theme: "inspiration" })
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    fetch("/api/homequotesection")
      .then((res) => res.json())
      .then((d) => {
        const q = Array.isArray(d) ? d[0] : d
        setQuote(q)
        setForm(q || { text: "", reference: "", theme: "inspiration" })
        setLoading(false)
      })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/homequotesection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const updated = await res.json()
    setQuote(updated)
    setForm(updated)
    setEdit(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm("Delete the quote?")) return
    setSaving(true)
    await fetch("/api/homequotesection", { method: "DELETE" })
    setQuote(null)
    setForm({ text: "", reference: "", theme: "inspiration" })
    setEdit(false)
    setSaving(false)
  }

  if (loading) return <div className="mt-10">Loading...</div>

  return (
    <div className="px-2 mt-6 space-y-6">
      {(edit || !quote) ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="sm:text-xl font-semibold">Quote Text</label>
            <input
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder="Enter quote"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-xl font-semibold">Reference</label>
            <input
              name="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. Mahatma Gandhi"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="sm:text-xl font-semibold">Theme</label>
            <select
              name="theme"
              value={form.theme}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white"
            >
              <option value="inspiration">Inspiration</option>
              <option value="gratitude">Gratitude</option>
              <option value="hope">Hope</option>
            </select>
          </div>

          <div className="flex gap-2 absolute right-3 sm:right-4 top-3 sm:top-4">
            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-600 px-4 ms:px-6 py-2 cursor-pointer text-white transition rounded-xl"
              onClick={handleSave}
              disabled={saving || !form.text}
            >
              {saving ? "Saving..." : quote ? "Update" : "Add Quote"}
            </button>

            {quote && (
              <button
                className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-red-600 hover:bg-red-600 px-4 ms:px-6 py-2 cursor-pointer text-red-600 hover:text-white transition rounded-xl"
                onClick={handleDelete}
                disabled={saving}
              >
                <TbTrash className="text-lg" />
              </button>
            )}

            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 px-4 ms:px-6 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={() => {
                setEdit(false)
                setForm(quote || { text: "", reference: "", theme: "inspiration" })
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            className="absolute text-sm sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium btn btn-primary border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
            onClick={() => setEdit(true)}
          >
            Edit Quote <TbEdit className="text-xl" />
          </button>

          <div className="text-base sm:text-xl font-semibold">Quote:</div>

          <div className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-800">
            <div className="text-sm sm:text-lg italic">"{quote?.text}"</div>
            {quote?.reference && (
              <div className="mt-2 text-sm text-gray-500 font-medium">- {quote.reference}</div>
            )}
            <div className="mt-1 text-sm text-violet-600 font-semibold">Theme: {quote.theme}</div>
          </div>
        </div>
      )}
    </div>
  )
}
