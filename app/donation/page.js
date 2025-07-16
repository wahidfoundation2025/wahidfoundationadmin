'use client'

import { useEffect, useState } from 'react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'

export default function DonationPage() {
  const [donations, setDonations] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(donations.length / rowsPerPage)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [donRes, projRes] = await Promise.all([
        fetch('/api/save-donation'),
        fetch('/api/projects'),
      ])
      const donations = await donRes.json()
      const projects = await projRes.json()
      setDonations(donations)
      setProjects(projects.projects || projects)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const getProjectName = (id) => {
    if (!id) return '-'
    const proj = projects.find((p) => p._id === id)
    return proj ? proj.title : id
  }

  const paginatedDonations = donations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="bg-white p-6 rounded-2xl min-h-full w-full">
      <h1 className="text-2xl font-bold mb-2">Donation Records</h1>
      <p className="text-base text-gray-600 mb-6">
        Track and manage donation entries across all projects.
      </p>

      <div className='overflow-x-auto'>
        <table className="w-full text-sm table-auto text-left">
          <thead className="bg-gray-200 text-gray-700 font-semibold border-b border-gray-300">
            <tr>
              {[
                'Name',
                'Email',
                'Amount',
                'Type',
                'Frequency',
                'Project',
                'Status',
                'Date',
              ].map((heading, idx, arr) => (
                <th
                  key={idx}
                  className={`py-3 px-4 font-medium ${idx === 0
                    ? 'rounded-tl-xl'
                    : idx === arr.length - 1
                      ? 'rounded-tr-xl text-right'
                      : ''
                    }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {paginatedDonations.length > 0 &&
              paginatedDonations.map((donation) => (
                <tr
                  key={donation._id}
                  className="border-b border-gray-300 last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-nowrap">{donation.name}</td>
                  <td className="py-3 px-4 text-nowrap">{donation.email}</td>
                  <td className="py-3 px-4 text-nowrap font-semibold">₹{donation.amount}</td>
                  <td className="py-3 px-4 text-nowrap">{donation.donationType}</td>
                  <td className="py-3 px-4 text-nowrap">{donation.donationFrequency}</td>
                  <td className="py-3 px-4 text-nowrap">{getProjectName(donation.projectId)}</td>
                  <td className="py-3 px-4 text-nowrap">
                    {donation.paymentId ? (
                      <span className="text-green-600 font-medium">Success</span>
                    ) : (
                      <span className="text-red-600 font-medium">Failed</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-nowrap text-right text-xs text-gray-500">
                    {donation.createdAt
                      ? new Date(donation.createdAt).toLocaleString()
                      : ''}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-700 rounded-b-xl">
        <div>
          Showing{' '}
          {Math.min((currentPage - 1) * rowsPerPage + 1, donations.length)} to{' '}
          {Math.min(currentPage * rowsPerPage, donations.length)} of {donations.length}{' '}
          entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="p-3 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default"
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="p-3 border border-gray-300 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  )
}
