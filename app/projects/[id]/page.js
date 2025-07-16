import { notFound } from 'next/navigation';

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
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <h1 className="text-3xl font-bold mb-8">{project.title}</h1>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Project Info</h2>
          <InfoRow label="Status" value={project.status} />
          <InfoRow label="Category" value={project.category || 'N/A'} />
          <InfoRow label="Location" value={project.location || 'N/A'} />
          <InfoRow label="Total Required" value={`₹${project.totalRequired?.toLocaleString()}`} />
          <InfoRow label="Collected" value={`₹${project.collected?.toLocaleString()}`} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <InfoRow label="Beneficiaries" value={project.beneficiaries || 0} />
          <InfoRow label="Completion" value={`${project.completion || 0}%`} />
          <InfoRow label="Days Left" value={project.daysLeft || 'N/A'} />
          <InfoRow label="Zakat Eligible" value={project.zakat_eligible ? 'Yes' : 'No'} />
          <InfoRow label="Interest Eligible" value={project.interest_earnings_eligible ? 'Yes' : 'No'} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Donation Info</h2>
          <InfoRow label="Min Donation Amount" value={`₹${project.minDonationAmount}`} />
          <InfoRow label="Donation Frequency" value={project.donationFrequency} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Project Manager</h2>
          <InfoRow label="Name" value={project.projectManager?.name || 'N/A'} />
          <InfoRow label="Email" value={project.projectManager?.email || 'N/A'} />
          <InfoRow label="Phone" value={project.projectManager?.phone || 'N/A'} />
        </div>
      </div>

      {/* Main Image */}
      {project.mainImage && (
        <Section title="Main Image">
          <img
            src={project.mainImage}
            alt="Main Project"
            className="rounded-xl shadow border border-gray-300 max-w-full max-h-[400px] object-cover"
          />
        </Section>
      )}

      {/* Photo Gallery */}
      {project.photoGallery?.length > 0 && (
        <Section title="Photo Gallery">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.photoGallery.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Gallery ${idx}`}
                className="w-full h-40 object-cover rounded-xl border border-gray-300 shadow-sm transition"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Description */}
      {project.description && (
        <Section title="Description">
          <p className="text-gray-800 leading-relaxed">{project.description}</p>
        </Section>
      )}

      {/* Overview */}
      {project.overview && (
        <Section title="Overview">
          <p className="text-gray-800 leading-relaxed">{project.overview}</p>
        </Section>
      )}

      {/* YouTube Video */}
      {project.youtubeIframe && (
        <Section title="Project Video">
          <div
            className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow"
            dangerouslySetInnerHTML={{ __html: project.youtubeIframe }}
          />
        </Section>
      )}
    </div>
  );
}

// Helper components
function InfoRow({ label, value }) {
  console.log(value)
  return (
    <div className="flex justify-between text-sm text-gray-700">
      <span className="font-medium">{label}:</span>

      <div>
        {value.length > 0 && typeof value !== 'string'
          ? value.map((val) => (
            <span key={val}>{val}, </span>
          ))
          : <span>{value}</span>
        }
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
