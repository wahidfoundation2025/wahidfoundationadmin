"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { TbEdit } from "react-icons/tb"
import { FaPlus, FaCheck } from "react-icons/fa6"
import { FcCancel } from "react-icons/fc"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("add") // "add" | "edit"
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function fetchCategories() {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    fetchCategories()
  }

  function openAddModal() {
    setFormData({ name: "", description: "" })
    setModalType("add")
    setModalOpen(true)
  }

  function openEditModal(cat) {
    setFormData({ name: cat.name, description: cat.description || "" })
    setEditId(cat._id)
    setModalType("edit")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    if (modalType === "add") {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    } else if (modalType === "edit" && editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    }

    setSaving(false)
    setModalOpen(false)
    fetchCategories()
  }

  return (
    <div className="p-6 bg-white rounded-2xl min-h-screen w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-start bg-violet-50 border-2 border-violet-300 p-3 rounded-xl"
            >
              <div>
                <h2 className="font-semibold text-lg">{cat.name}</h2>
                <p className="text-sm text-gray-500">{cat.description}</p>
              </div>

              <div className="space-x-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-violet-600 hover:bg-violet-200 rounded-3xl p-2 transition"
                  title="Edit"
                >
                  <TbEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:bg-red-200 rounded-3xl p-2 transition"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "add" ? "Add Category" : "Edit Category"}
            </h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="p-2.5 w-full border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="p-2.5 w-full border border-gray-300 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
