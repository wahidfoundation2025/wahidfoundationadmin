"use client"
import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [projects, setProjects] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

  const getProjectName = (id) => id; // Replace with actual lookup logic
  const getDonationAmount = (donor, pid) =>
    donor.donations?.find((d) => d.projectId === pid)?.amount || 0;

  const totalPages = Math.ceil(donors.length / rowsPerPage);
  const paginatedDonors = donors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <h1 className="text-2xl font-bold mb-6">Donors</h1>

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
            {paginatedDonors.length > 0 &&
              paginatedDonors.map((donor) => {
                const color = donor.colorCode || "#6B7280"; // fallback gray
                const initials = donor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US";

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
                      <ul className="list-disc pl-4">
                        {donor.projectsDonatedTo?.length > 0 ? (
                          donor.projectsDonatedTo.map((pid) => (
                            <li key={pid}>
                              {getProjectName(pid)}: ₹{getDonationAmount(donor, pid)}
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
            className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
          >
            <FaAnglesLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-3 border cursor-pointer hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-default disabled:bg-white"
          >
            <FaAnglesRight />
          </button>
        </div>
      </div>
    </div>
  )
}
