"use client"
import { useEffect, useState } from 'react'
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6"

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [projects, setProjects] = useState([])
  const [donations, setDonations] = useState([])
  const [clerkUsers, setClerkUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)

      const [donorRes, projectRes, donationRes, clerkUsersRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/projects'),
        fetch('/api/save-donation'),
        fetch('/api/clerk-users') // 🆕 Call Clerk users API
      ])

      const donors = await donorRes.json()
      const projectsData = await projectRes.json()
      const projects = projectsData.projects || projectsData
      const donations = await donationRes.json()
      const clerkUsersData = await clerkUsersRes.json()

      setDonors(donors)
      setProjects(projects)
      setDonations(donations)
      setClerkUsers(clerkUsersData)

      setLoading(false)
    }
    fetchAll()
  }, [])

  const getProjectName = (id) => {
    const project = projects.find((p) => p._id === id);
    return project ? project.title || project.name : id; // fallback if not found
  };

  const totalPages = Math.ceil(donors.length / rowsPerPage)
  const paginatedDonors = donors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Donors</h1>

      <div className="bg-white border border-gray-300 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm table-auto text-left">
          <thead className="bg-gray-200 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              {["Avatar", "Name", "Email", "Total Donated", "Total Projects", "Projects Donated"].map((title, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? "rounded-tl-xl" : idx === 5 ? "rounded-tr-xl" : ""
                    }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {paginatedDonors.map((donor) => {
              const color = donor.colorCode || "#6B7280"
              const initials =
                donor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US"
              return (
                <tr key={donor._id} className="border-b border-gray-300 last:border-none">
                  <td className="py-3 px-4 text-sm">
                    <div
                      style={{
                        backgroundColor: `${color}20`,
                        color: color,
                      }}
                      className="min-w-8 w-8 min-h-8 rounded-full font-bold flex items-center justify-center text-sm"
                    >
                      {initials}
                    </div>
                  </td>
                  <td className="py-3 px-4">{donor.name}</td>
                  <td className="py-3 px-4">{donor.email}</td>
                  <td className="py-3 px-4">₹{donor.totalDonated}</td>
                  <td className="py-3 px-4">{donor.totalProjects}</td>
                  <td className="py-3 px-4">
                    <ul>
                      {donor.projectsDonatedTo?.length > 0 ? (
                        donor.projectsDonatedTo.map((pid) => (
                          <li key={pid}>
                            {getProjectName(pid)}
                          </li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-700">
        <div>
          Showing {Math.min((currentPage - 1) * rowsPerPage + 1, donors.length)} to{' '}
          {Math.min(currentPage * rowsPerPage, donors.length)} of {donors.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-3 border hover:bg-gray-200 rounded-xl disabled:opacity-50"
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-3 border hover:bg-gray-200 rounded-xl disabled:opacity-50"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>

      {/* ------------------- CLERK USERS TABLE ------------------- */}
      <h1 className="text-xl sm:text-2xl font-bold mt-12 mb-6">Registered Users</h1>
      <div className="bg-white border border-gray-300 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm table-auto text-left">
          <thead className="bg-gray-200 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              {["Profile", "Name", "Email", "Phone"].map((title, idx) => (
                <th
                  key={idx}
                  className={`py-3 px-4 text-nowrap font-medium ${idx === 0 ? "rounded-tl-xl" : idx === 3 ? "rounded-tr-xl" : ""
                    }`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {!!clerkUsers.length
              ? clerkUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-300 last:border-none">
                  <td className="py-3 px-4">
                    <img
                      src={user.image_url}
                      alt={user.first_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                  <td className="py-3 px-4">
                    {user.email_addresses?.[0]?.email_address || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {user.phone_numbers?.[0]?.phone_number || '—'}
                  </td>
                </tr>
              )) : (
                <p className="my-2 mx-4">Something Went Wrong!!</p>
              )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
