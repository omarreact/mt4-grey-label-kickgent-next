import { redirect } from "next/navigation";

/**
 * Exact source parity entry point. The original Kickgent document and its
 * responsive assets are shipped in /public/source, so this route keeps its
 * original DOM, CSS, animation timing and client-side interactions intact.
 */
export default function Home() {
  redirect("/source/index.html");
}
