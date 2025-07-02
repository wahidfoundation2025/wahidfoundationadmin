'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Pencil, Eye, Plus } from 'lucide-react'


const Table = ({ children }) => <div className="w-full overflow-x-auto border rounded-md">{children}</div>
const TableHeader = ({ children }) => <thead className="bg-gray-100 text-gray-700">{children}</thead>
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>
const TableRow = ({ children }) => <tr className="hover:bg-gray-50">{children}</tr>
const TableHead = ({ children, className = '' }) => (
  <th className={`px-4 py-2 text-left font-medium ${className}`}>{children}</th>
)
const TableCell = ({ children, className = '' }) => <td className={`px-4 py-2 ${className}`}>{children}</td>

const Button = ({ children, onClick, variant = 'default', disabled = false, className = '' }) => {
  const base = 'px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition'
  const variants = {
    default: 'bg-gray-800 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Input = ({ ...props }) => (
  <input
    className="border px-3 py-2 rounded-md text-sm w-full"
    {...props}
  />
)

const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border px-3 py-2 rounded-md text-sm w-full"
  >
    {children}
  </select>
)

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10
  const router = useRouter()

  useEffect(() => {
    async function fetchProjects() {
      let url = `/api/projects?page=${currentPage}&limit=${limit}`
      if (search) url += `&search=${search}`
      if (statusFilter) url += `&status=${statusFilter}`

      const res = await fetch(url)
      const data = await res.json()
      setProjects(data.projects || data)
      setTotalPages(data.totalPages || 1)
    }

    fetchProjects()
  }, [search, statusFilter, currentPage])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    setProjects(projects.filter((p) => p._id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => router.push('/projects/create')} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} /> Create Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onChange={setStatusFilter}>
          <SelectItem value="">All Statuses</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Upcoming">Upcoming</SelectItem>
        </Select>
      </div>

      <Table>
        <table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/projects/${project._id}/edit`)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
