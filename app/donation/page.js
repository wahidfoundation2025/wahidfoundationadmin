"use client"
import { useEffect, useState } from 'react'

export default function DonationPage() {
  const [donations, setDonations] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [donRes, projRes] = await Promise.all([
        fetch('/api/save-donation'),
        fetch('/api/projects'),
      ])
      const donations = await donRes.json()

      const projects = await projRes.json()
      console.log('Projects:', projects)
      setDonations(donations)
      setProjects(projects.projects || projects) 
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Helper to get project name from id
  const getProjectName = (id) => {
    if (!id) return '-'
    console.log(id)
    const proj = projects.find((p) => p._id === id)
    return proj ? proj.title : id
  }

  return (
    <div className="min-h-screen w-full  flex flex-col py-10 px-4">
      <div className="w-full max-w-6xl flex-1 flex flex-col">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center uppercase">Donation Records</h1>

        {/* Card Container */}
        <div className="bg-white rounded-xl p-3 flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              Loading...
            </div>
          ) : donations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              No donations found.
            </div>
          ) : (
            <div className="overflow-auto rounded border">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Email</th>
                    <th className="px-4 py-3 border">Amount</th>
                    <th className="px-4 py-3 border">Type</th>
                    <th className="px-4 py-3 border">Frequency</th>
                    <th className="px-4 py-3 border">Project</th>
                    <th className="px-4 py-3 border">Status</th>
                    <th className="px-4 py-3 border">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {donations.map((donation) => (
                    <tr
                      key={donation._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 border">{donation.name}</td>
                      <td className="px-4 py-2 border">{donation.email}</td>
                      <td className="px-4 py-2 border">₹{donation.amount}</td>
                      <td className="px-4 py-2 border">{donation.donationType}</td>
                      <td className="px-4 py-2 border">{donation.donationFrequency}</td>
                      <td className="px-4 py-2 border">{getProjectName(donation.projectId)}</td>
                      <td className="px-4 py-2 border">
                        {donation.paymentId ? (
                          <span className="text-green-600 font-semibold">Success</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Failed</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-xs text-gray-500">
                        {donation.createdAt
                          ? new Date(donation.createdAt).toLocaleString()
                          : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
