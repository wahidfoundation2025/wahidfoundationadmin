import { notFound } from 'next/navigation'

async function getProject(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProject(params.id);
  if (!project) return notFound();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">{project.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Category:</strong> {project.category || 'N/A'}</p>
          <p><strong>Location:</strong> {project.location || 'N/A'}</p>
          <p><strong>Total Required:</strong> ₹{project.totalRequired?.toLocaleString()}</p>
          <p><strong>Collected:</strong> ₹{project.collected?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p><strong>Beneficiaries:</strong> {project.beneficiaries || 0}</p>
          <p><strong>Completion:</strong> {project.completion || 0}%</p>
          <p><strong>Days Left:</strong> {project.daysLeft || 'N/A'}</p>
          <p><strong>Zakat Eligible:</strong> {project.zakat_eligible ? 'Yes' : 'No'}</p>
          <p><strong>Interest Eligible:</strong> {project.interest_earnings_eligible ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Donation</h2>
          <p><strong>Donation Frequency:</strong> {project.donationFrequency}</p>
          <p><strong>Min Donation Amount:</strong> ₹{project.minDonationAmount}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Project Manager</h2>
          <p><strong>Name:</strong> {project.projectManager?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {project.projectManager?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {project.projectManager?.phone || 'N/A'}</p>
        </div>
      </div>

      {project.mainImage && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Main Image</h2>
          <img src={project.mainImage} alt="Main" className="w-full max-w-4xl rounded-md shadow" />
        </div>
      )}

      {project.photoGallery?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.photoGallery.map((url, idx) => (
              <img key={idx} src={url} alt={`Gallery ${idx}`} className="w-full h-40 object-cover rounded shadow" />
            ))}
          </div>
        </div>
      )}

      {project.description && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-800">{project.description}</p>
        </div>
      )}

      {project.overview && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-800">{project.overview}</p>
        </div>
      )}

      {project.youtubeIframe && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <div className="aspect-video w-full max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: project.youtubeIframe }} />
        </div>
      )}
    </div>
  );
}
