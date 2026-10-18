import ProjectDetail, { projectMetadata, projectParams } from "@/components/ProjectDetail";

export const dynamicParams = false;
export const generateStaticParams = projectParams;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  return projectMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  return <ProjectDetail lang="en" slug={(await params).slug} />;
}
