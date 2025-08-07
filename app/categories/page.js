"use client"

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { TbEdit } from 'react-icons/tb'
import { FaCheck } from 'react-icons/fa6'
import { FcCancel } from "react-icons/fc";
import withAccessControl from '@/lib/withAccessControl';

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ name: '', description: '' })
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchCategories() {
    try {
      setLoading(true);

      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  function startEditing(cat) {
    setEditingId(cat._id)
    setEditData({ name: cat.name, description: cat.description || '' })
  }

  async function saveEdit(id) {
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    setEditingId(null)
    setEditData({ name: '', description: '' })
    fetchCategories()
  }

  async function handleAdd(e) {
    e.preventDefault()
    setAdding(true)
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    })
    setNewCategory({ name: '', description: '' })
    setAdding(false)
    fetchCategories()
  }

  return (
    <div className="p-4 sm:p-6 bg-white sm:rounded-2xl min-h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
      </div>

      {loading ?
        <div className="text-center py-10 text-gray-500">Loading...</div>
        : <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 grid-cols-1 gap-4 w-full mb-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-start bg-violet-50 border-2 border-violet-300 p-3 rounded-xl"
            >
              <div className="w-full">
                {editingId === cat._id ? (
                  <>
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full mb-2 p-2 rounded-lg border border-gray-300"
                    />
                    <input
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold sm:text-lg">{cat.name}</h2>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </>
                )}
              </div>

              <div className="space-x-2 ml-4 flex-shrink-0">
                {editingId === cat._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(cat._id)}
                      className="text-green-600 hover:bg-green-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Save"
                    >
                      <FaCheck size={20} />
                    </button>
                    <button
                      onClick={() => setEditingId("")}
                      className="text-red-600 hover:bg-red-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Cancel"
                    >
                      <FcCancel size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(cat)}
                      className="text-violet-600 hover:bg-violet-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Edit"
                    >
                      <TbEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:bg-red-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
          }
        </div>
      }

      {/* Add Category Form */}
      <div className="bg-white border border-gray-300 rounded-xl p-6 w-full">
        <h2 className="font-semibold text-lg mb-4">Add Category</h2>

        <form onSubmit={handleAdd} className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={adding}
              className="px-10 py-2 font-medium cursor-pointer bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-xl"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default withAccessControl(CategoriesPage, "cms");
