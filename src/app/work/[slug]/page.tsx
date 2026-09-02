import { redirect } from "next/navigation";
import { PROJECTS } from "@/data/projects";

/* Pre-render a path for every project so /work/<slug> is a real, shareable URL */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} - Abdul Nawfal`,
    description: project.description,
  };
}

/* A direct hit lands on the home page, where Work opens the panel from the URL */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/?case=${slug}`);
}