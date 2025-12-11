// src/app/not-found/page.tsx   ← this file MUST exist
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function NotFound() {
    notFound();
}