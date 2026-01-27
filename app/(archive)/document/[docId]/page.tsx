// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVE DOCUMENT PAGE
//
// Dynamic route that renders archived documents by ID.
// Uses the ArchiveDocument component with paginated layout.
//
// ROUTES:
// /document/1     → D1-0 (Scope & Definitions)
// /document/0-1   → D0-1 (Typographic Constitution, superseded)
// /document/0-2   → D0-2 (Typographic Constitution v2)
// ═══════════════════════════════════════════════════════════════════════════════

import { notFound } from 'next/navigation';
import { ArchiveDocument } from '@/components/archive';
import { getDocument } from '@/lib/archive/demo-data';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface DocumentPageProps {
  params: Promise<{
    docId: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: DocumentPageProps) {
  const { docId } = await params;
  const doc = getDocument(docId);
  
  if (!doc) {
    return { title: 'Document Not Found' };
  }
  
  return {
    title: `${doc.meta.docCode} — ${doc.meta.title}`,
    description: `${doc.meta.registry} | REV ${doc.meta.rev} | ${doc.meta.status}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────────

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { docId } = await params;
  const doc = getDocument(docId);
  
  if (!doc) {
    notFound();
  }
  
  return (
    <ArchiveDocument
      meta={doc.meta}
      blocks={doc.blocks}
    />
  );
}
