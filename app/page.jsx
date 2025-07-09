'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, CheckCircle, DollarSign } from 'lucide-react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    activeCount: 0,
    completedCount: 0,
    totalDonors: 0,
    totalDonations: 0,
    monthlyDonations: [],
    months: [],
  })

  useEffect(() => {
    async function fetchData() {
      const [projectRes, donorRes, donationRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/donors'),
        fetch('/api/save-donation'),
      ])
      const projectData = await projectRes.json()
      const donorData = await donorRes.json()
      const donationData = await donationRes.json()

      // Calculate monthly donations
      const monthly = {}
      const months = []
      donationData.forEach((don) => {
        const date = new Date(don.createdAt)
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        if (!monthly[key]) {
          monthly[key] = 0
          months.push(key)
        }
        monthly[key] += don.amount || 0
      })
      months.sort()
      const monthlyDonations = months.map((m) => monthly[m])

      setSummary({
        activeCount: projectData.activeCount,
        completedCount: projectData.completedCount,
        totalDonors: donorData.length,
        totalDonations: donationData.reduce((sum, d) => sum + (d.amount || 0), 0),
        monthlyDonations,
        months,
      })
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: 'Active Projects',
      value: summary.activeCount,
      icon: <Activity className="text-green-600 w-6 h-6" />,
      bg: 'bg-green-100',
    },
    {
      title: 'Total Donors',
      value: summary.totalDonors,
      icon: <Users className="text-blue-600 w-6 h-6" />,
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Donations',
      value: `₹${summary.totalDonations}`,
      icon: <CheckCircle className="text-yellow-600 w-6 h-6" />,
      bg: 'bg-yellow-100',
    },
    {
      title: 'Completed Projects',
      value: summary.completedCount,
      icon: <DollarSign className="text-purple-600 w-6 h-6" />,
      bg: 'bg-purple-100',
    },
  ]

  const donationBarData = {
    labels: summary.months,
    datasets: [
      {
        label: 'Donations (in ₹)',
        data: summary.monthlyDonations,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  }

  const projectPieData = {
    labels: ['Active', 'Completed'],
    datasets: [
      {
        data: [summary.activeCount, summary.completedCount],
        backgroundColor: ['#34d399', '#a78bfa'],
      },
    ],
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl p-6">
      <h1 className="text-2xl font-semibold">Active Projects</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className='flex flex-1 flex-col gap-3 border-[1px] border-gray-300 rounded-xl p-4'          >
            <div className={`${stat.bg} w-fit p-2.5 rounded-xl`}>{stat.icon}</div>
            <div>
              <h2 className="text-sm font-medium">{stat.title}</h2>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>


      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow border border-gray-300 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Monthly Donations</h2>
          <Bar data={donationBarData} />
        </div>

        <div className="p-4 bg-white shadow border border-gray-300 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Project Status Breakdown</h2>
          <Pie data={projectPieData} style={{ maxHeight: "300px" }} />
        </div>
      </div>
    </div>
  )
}


// const DashboardOverview = ({ stats }) => {

//   function formatAmount(amount) {
//     if (!amount) return "₹0.00"

//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   }

//   return (
//     <div className="flex flex-row gap-4 mt-6">
//       {[
//         { name: "Active Projects", value: stats.value, percentage: 0, },
//         { name: "Total Donations", value: formatAmount(stats.value), percentage: revenueStats?.percentageChange, },
//         { name: "Total Donors", value: stats.value, percentage: 100 },
//         { name: "Completed Projects", value: "45", percentage: -9 },
//       ].map(({ title, value }) => (
//         <div key={`${title}-${value}}`} className='flex flex-1 flex-col gap-3 border-[1px] border-gray-300 rounded-xl p-4'>
//           <MainIcon name={title} />
//           <h4 className='text-[#4D4D5A] text-base font-medium'>{title}</h4>
//           <h1 className='text-3xl font-semibold'>{value}</h1>
//         </div>
//       ))}
//     </div>
//   )
// }

// const MainIcon = ({ name }) => {
//   return (
//     <img
//       alt="Icon"
//       className='w-12 h-12 object-contain'
//       src={name === "Users" ?
//         Users : name === "Revenue" ?
//           Revenue : name === "Active Sessions" ?
//             ActiveSessions : Tickets}
//     />
//   )
// }
