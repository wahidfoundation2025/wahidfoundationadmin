'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Pencil, Eye, Plus } from 'lucide-react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import { TbEdit } from 'react-icons/tb'

const Input = (props) => (
  <input className="border px-3 py-2 rounded-md text-sm w-full" {...props} />
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)
  const rowsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      let url = `/api/projects?page=${currentPage}&limit=${rowsPerPage}`
      if (search) url += `&search=${search}`
      if (statusFilter) url += `&status=${statusFilter}`

      const res = await fetch(url)
      const data = await res.json()
      setProjects(data.projects || data)
      setTotalPages(data.totalPages || 1)
      setTotalProjects(data.totalCount || data.projects?.length || 0)
    }

    fetchProjects()
  }, [search, statusFilter, currentPage])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter((p) => p._id !== id))
  }

  return (
    <div className='min-h-full w-full bg-white p-4 sm:p-6 sm:rounded-2xl'>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>

        <button
          onClick={() => router.push('/projects/create')}
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-4 sm:px-6 py-2 cursor-pointer text-white transition rounded-xl"
        >
          <Plus size={16} /> Create Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm w-full"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 cursor-pointer rounded-xl px-4 py-2.5 text-sm w-full bg-white text-gray-800 appearance-none"
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm table-auto text-left">
          <thead className="bg-gray-200 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              {['Title', 'Status', 'Actions'].map((heading, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? 'rounded-tl-xl' : idx === 2 ? 'rounded-tr-xl text-right' : ''
                    }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-gray-300 last:border-none">
                <td className="py-3 px-4">{project.title}</td>
                <td className="py-3 px-4">{project.status}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => router.push(`/projects/${project._id}`)}
                      className="text-blue-600 hover:bg-blue-200 rounded-3xl p-2 cursor-pointer transition"
                      title="View"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => router.push(`/projects/${project._id}/edit`)}
                      className="text-violet-600 hover:bg-violet-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Edit"
                    >
                      <TbEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:bg-red-200 rounded-3xl p-2 cursor-pointer transition"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-700  rounded-b-xl">
        <div>
          Showing {Math.min((currentPage - 1) * rowsPerPage + 1, totalProjects)} to{' '}
          {Math.min(currentPage * rowsPerPage, totalProjects)} of {totalProjects} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  )
}
