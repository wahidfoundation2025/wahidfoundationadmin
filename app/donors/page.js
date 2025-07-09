"use client"
import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [projects, setProjects] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [donorRes, projectRes, donationRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/projects'),
        fetch('/api/save-donation'),
      ])
      const donors = await donorRes.json()
      console.log('Donors:', donors)
      const projectsData = await projectRes.json()
      const projects = projectsData.projects || projectsData
      const donations = await donationRes.json()
      setDonors(donors)
      setProjects(projects)
      setDonations(donations)
      setLoading(false)
    }
    fetchAll()
  }, [])


  const getProjectName = (id) => {
    if (!id) return '-'
    const idStr = id.toString()
    const proj = projects.find((p) => p._id?.toString() === idStr)
    return proj ? proj.title : idStr
  }


  const getDonationAmount = (donor, projectId) => {
    if (!donor.donations || !Array.isArray(donor.donations)) return 0
    const pidStr = projectId.toString()
    return donations
      .filter((d) => d._id && donor.donations.some((id) => id.toString() === d._id.toString()) && d.projectId && d.projectId.toString() === pidStr)
      .reduce((sum, d) => sum + (d.amount || 0), 0)
  }

  return (
    <div className="min-h-screen w-full flex flex-col py-10 px-4">
      <div className="w-full max-w-6xl flex-1 flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center uppercase">Donors</h1>
        <div className="bg-white rounded-xl p-3 flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              Loading...
            </div>
          ) : donors.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              No donors found.
            </div>
          ) : (
            <div className="overflow-auto rounded border">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    {/* <th className="px-4 py-3 border">Profile</th> */}
                    <th className="px-4 py-3 border">Name</th>
                    <th className="px-4 py-3 border">Email</th>
                    <th className="px-4 py-3 border">Total Donated</th>
                    <th className="px-4 py-3 border">Total Projects</th>
                    <th className="px-4 py-3 border">Projects Donated</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {donors.map((donor) => (
                    <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                      {/* Profile picture removed */}
                      <td className="px-4 py-2 border">{donor.name}</td>
                      <td className="px-4 py-2 border">{donor.email}</td>
                      <td className="px-4 py-2 border">₹{donor.totalDonated}</td>
                      <td className="px-4 py-2 border">{donor.totalProjects}</td>
                      <td className="px-4 py-2 border">
                        <ul className="list-disc pl-4">
                          {donor.projectsDonatedTo && donor.projectsDonatedTo.length > 0 ? (
                            donor.projectsDonatedTo.map((pid) => (
                              <li key={pid}>
                                {getProjectName(pid)}
                                {': '}₹{getDonationAmount(donor, pid)}
                              </li>
                            ))
                          ) : (
                            <li>-</li>
                          )}
                        </ul>
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
