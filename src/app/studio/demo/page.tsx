import { notFound } from "next/navigation";
import { StudioApp } from "@/components/studio/StudioApp";

/**
 * Development only: the real studio, opened on the built-in content with
 * no backend, so its design can be checked locally without Supabase.
 * Nothing here saves or publishes. Production builds answer 404.
 */
export default function StudioDemoPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StudioApp demo />;
}
