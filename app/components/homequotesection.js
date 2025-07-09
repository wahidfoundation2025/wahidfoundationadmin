"use client"
import { useEffect, useState } from "react"

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
        setQuote(Array.isArray(d) ? d[0] : d)
        setForm(Array.isArray(d) && d[0] ? d[0] : d || { text: "", reference: "", theme: "inspiration" })
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

  if (loading) return <div>Loading...</div>

  return (
    <div className="bg-white p-6 rounded shadow text-black min-h-[200px]">
      <h2 className="text-xl font-semibold mb-4">Quote Section Editor</h2>
      {edit || !quote ? (
        <div className="mb-6 flex flex-col gap-2">
          <input name="text" value={form.text} onChange={handleChange} placeholder="Quote text" className="w-full border border-gray-300 rounded px-3 py-2" />
          <input name="reference" value={form.reference} onChange={handleChange} placeholder="Reference (optional)" className="w-full border border-gray-300 rounded px-3 py-2" />
          <select name="theme" value={form.theme} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="inspiration">Inspiration</option>
            <option value="gratitude">Gratitude</option>
            <option value="hope">Hope</option>
          </select>
          <button className="btn btn-primary mt-2" onClick={handleSave} disabled={saving || !form.text}>{saving ? "Saving..." : (quote ? "Update Quote" : "Add Quote")}</button>
          {quote && <button className="btn btn-error mt-2" onClick={handleDelete} disabled={saving}>Delete Quote</button>}
        </div>
      ) : (
        <div className="mb-6">
          <div className="border rounded px-3 py-2 bg-gray-50">
            <span className="block">"{quote.text}"</span>
            {quote.reference && <span className="block text-xs text-gray-500">- {quote.reference}</span>}
            <span className="block text-xs text-blue-600">Theme: {quote.theme}</span>
          </div>
          <button className="btn btn-primary mt-4" onClick={() => setEdit(true)}>Edit</button>
        </div>
      )}
    </div>
  )
}
