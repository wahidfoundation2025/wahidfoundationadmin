import ProjectClient from './ProjectClient';
import { notFound } from 'next/navigation';

async function getProject(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.log("Error: ", error);
  }
}

export default async function Page({ params }) {
  const project = await getProject(params.id);
  if (!project) return notFound();

  return <ProjectClient project={project} />;
}
