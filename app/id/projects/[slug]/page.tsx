import ProjectDetail, { projectMetadata, projectParams } from "@/components/ProjectDetail";

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: PageProps<"/id/projects/[slug]">) {
  return projectMetadata("id", (await params).slug);
}

export default async function Page({ params }: PageProps<"/id/projects/[slug]">) {
  return <ProjectDetail lang="id" slug={(await params).slug} />;
}
