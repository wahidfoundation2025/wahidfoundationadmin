import { notFound } from 'next/navigation'

async function getProject(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.id)

  if (!project) return notFound()

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Status:</strong> {project.status}</p>
        <p><strong>Category:</strong> {project.category || 'N/A'}</p>
        <p><strong>Location:</strong> {project.location || 'N/A'}</p>
        <p><strong>Total Required:</strong> ₹{project.totalRequired?.toLocaleString()}</p>
        <p><strong>Collected:</strong> ₹{project.collected?.toLocaleString()}</p>
        <p><strong>Beneficiaries:</strong> {project.beneficiaries || 0}</p>
        <p><strong>Days Left:</strong> {project.daysLeft || 'N/A'}</p>
        <p><strong>Zakat Eligible:</strong> {project.zakat_eligible ? 'Yes' : 'No'}</p>
        <p><strong>Interest Eligible:</strong> {project.interest_earnings_eligible ? 'Yes' : 'No'}</p>
      </div>

      {project.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-800">{project.description}</p>
        </div>
      )}

      {project.overview && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-800">{project.overview}</p>
        </div>
      )}

      {project.youtubeIframe && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <div
            className="aspect-video w-full max-w-2xl"
            dangerouslySetInnerHTML={{ __html: project.youtubeIframe }}
          />
        </div>
      )}
    </div>
  )
}
