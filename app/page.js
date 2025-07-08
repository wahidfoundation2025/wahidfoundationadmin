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
  })

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setSummary({
        activeCount: data.activeCount,
        completedCount: data.completedCount,
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
      value: 0, // dummy
      icon: <Users className="text-blue-600 w-6 h-6" />,
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Donations',
      value: 0, // dummy
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

  // Dummy donation data (total donations per month)
  const donationBarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations (in ₹)',
        data: [10000, 15000, 8000, 20000, 12000, 17000],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Tailwind blue-500
      },
    ],
  }

  // Dummy project status breakdown
  const projectPieData = {
    labels: ['Active', 'Completed'],
    datasets: [
      {
        data: [summary.activeCount, summary.completedCount], // Assume 5 pending
        backgroundColor: ['#34d399', '#a78bfa'], // Tailwind green/purple/yellow
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow flex items-center justify-between ${stat.bg}`}
          >
            <div>
              <h2 className="text-sm font-medium">{stat.title}</h2>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
            <div>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Donations</h2>
          <Bar data={donationBarData} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Project Status Breakdown</h2>
          <Pie data={projectPieData} />
        </div>
      </div>
    </div>
  )
}
