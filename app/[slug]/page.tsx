import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageRenderer } from "@/components/PageRenderer";
import { pageList, pages } from "@/content/site";

export function generateStaticParams() { return pageList.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = pages[slug]; return page ? { title: page.meta, description: page.description } : {}; }
export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!pages[slug]) notFound();
  redirect(`/source/${slug}/index.html`);
}
