import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KickgentExperience } from "@/components/KickgentExperience";
import { kickgentPages, pageSlugs } from "@/content/kickgent-pages";

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = kickgentPages[slug];
  return page ? { title: page.title, description: page.description } : {};
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = kickgentPages[slug];
  if (!page || slug === "home") notFound();
  return <KickgentExperience page={page} />;
}
