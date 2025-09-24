import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import InfoRow from "@/app/components/InfoRow";

async function getProject(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return notFound();

  return (
    <div className="min-h-full w-full bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <Link
          href={`/projects/${id}/edit`}
          className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center gap-2"
        >
          <Pencil className="w-5 h-5" />
          <span className="text-sm font-medium">Edit</span>
        </Link>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Project Info</h2>
          <InfoRow label="Status" value={project.status} />
          <InfoRow label="Category" value={project.category || "N/A"} />
          <InfoRow label="Location" value={project.location || "N/A"} />
          <InfoRow
            label="Total Required"
            value={`₹${project.totalRequired?.toLocaleString()}`}
          />
          <InfoRow
            label="Collected"
            value={`₹${project.collected?.toLocaleString()}`}
          />
          <InfoRow label="Slug" value={project.slug || "N/A"} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <InfoRow label="Beneficiaries" value={project.beneficiaries || 0} />
          <InfoRow label="Completion" value={`${project.completion || 0}%`} />
          <InfoRow label="Days Left" value={project.daysLeft || "N/A"} />
          <InfoRow
            label="Zakat Eligible"
            value={project.zakat_eligible ? "Yes" : "No"}
          />
          <InfoRow
            label="Interest Eligible"
            value={project.interest_earnings_eligible ? "Yes" : "No"}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Donation Info</h2>
          <InfoRow
            label="Min Donation Amount"
            value={`₹${project.minDonationAmount}`}
          />
          <InfoRow
            label="Donation Frequency"
            value={project.donationFrequency}
          />
          <InfoRow
            label="Donation Options"
            value={
              project.donationOptions
                ?.filter((opt) => opt.isEnabled)
                .map((opt) => opt.type) || "N/A"
            }
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Project Manager</h2>
          <InfoRow label="Name" value={project.projectManager?.name || "N/A"} />
          <InfoRow
            label="Email"
            value={project.projectManager?.email || "N/A"}
          />
          <InfoRow
            label="Phone"
            value={project.projectManager?.phone || "N/A"}
          />
        </div>
      </div>

      {/* Main Image */}
      <div className="grid grid-cols-2 gap-6">
        {project.mainImage && (
          <Section title="Main Image">
            <img
              src={project.mainImage}
              alt="Main Project Image"
              className="rounded-xl shadow border border-gray-300 max-w-full max-h-[400px] object-cover"
            />
          </Section>
        )}
        {project.cardImage && (
          <Section title="Card Image">
            <img
              src={project.cardImage}
              alt="Card Project Image"
              className="rounded-xl shadow border border-gray-300 max-w-full max-h-[400px] object-cover"
            />
          </Section>
        )}
      </div>

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
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: project.description }}
          ></div>
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

      {/* OG Metadata */}
      {project.og &&
        (project.og.title ||
          project.og.description ||
          project.og.image ||
          project.og.url) && (
          <Section title="OG Metadata">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
              <InfoRow label="Title" value={project.og.title || "N/A"} />
              <InfoRow
                label="Description"
                value={project.og.description || "N/A"}
              />
              {project.og.image && (
                <div>
                  <span className="block text-sm font-medium mb-1">Image:</span>
                  <img
                    src={project.og.image}
                    alt="OG Image"
                    className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
              <InfoRow label="URL" value={project.og.url || "N/A"} />
            </div>
          </Section>
        )}

      {/* Impact */}
      {project.impact?.length > 0 && (
        <Section title="Impact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.impact.map((imp, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-md border p-6 space-y-3 ${
                  imp.type === "Direct"
                    ? "bg-green-200 border-green-300"
                    : imp.type === "Indirect"
                    ? "bg-amber-100 border-amber-200"
                    : "bg-violet-100 border-violet-200"
                }`}
              >
                <h3 className="text-lg font-semibold">{imp.title}</h3>
                <InfoRow label="Type" value={imp.type} />
                <InfoRow label="Description" value={imp.description} />
              </div>
            ))}
          </div>
        </Section>
      )}
      
      {/* Timeline */}
      {project.timeline?.length > 0 && (
        <Section title="Timeline Events">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.timeline.map((event, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-md border p-6 space-y-3 ${
                  event.status === "Completed"
                    ? "bg-green-200 border-green-300"
                    : event.status === "In-Progress"
                    ? "bg-amber-100 border-amber-200"
                    : "bg-violet-100 border-violet-200"
                }`}
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <InfoRow label="Date" value={event.date} />
                <InfoRow label="Status" value={event.status} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Schemes */}
      {project.scheme?.length > 0 && (
        <Section title="Schemes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.scheme.map((sch, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3"
              >
                <h3 className="text-lg font-semibold">{sch.name}</h3>
                <InfoRow label="Description" value={sch.description || "N/A"} />
                <InfoRow
                  label="Link"
                  value={
                    sch.link ? (
                      <a
                        href={sch.link}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sch.link}
                      </a>
                    ) : (
                      "N/A"
                    )
                  }
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Updates */}
      {project.updates?.length > 0 && (
        <Section title="Updates">
          <div className="space-y-4">
            {project.updates.map((upd, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3"
              >
                <h3 className="text-lg font-semibold">{upd.version}</h3>
                <InfoRow
                  label="Date"
                  value={new Date(upd.date).toLocaleDateString()}
                />
                <InfoRow label="Content" value={upd.content} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SEO Metadata */}
      {(project.metatitle ||
        project.metadescription ||
        project.target_keywords?.length > 0) && (
        <Section title="SEO Metadata">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-6 space-y-3">
            <InfoRow label="Meta Title" value={project.metatitle || "N/A"} />
            <InfoRow
              label="Meta Description"
              value={project.metadescription || "N/A"}
            />
            <InfoRow
              label="Target Keywords"
              value={project.target_keywords || "N/A"}
            />
            <InfoRow
              label="Schema Markup"
              value={JSON.stringify(project.scheme) || "N/A"}
            />
          </div>
        </Section>
      )}
    </div>
  );
}

// Helper component

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
