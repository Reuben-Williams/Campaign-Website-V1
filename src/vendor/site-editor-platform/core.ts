export type BuilderAdapterKind = "central" | "supabase" | "memory";

export type EditableKind = "text" | "richText" | "image" | "link" | "sections" | "icon" | "postCollection";

export type EditableValue =
  | { type: "text"; value: string }
  | { type: "richText"; value: string }
  | { type: "image"; src: string; alt?: string; mediaId?: string }
  | { type: "link"; href: string; label: string }
  | { type: "sections"; value: string[] }
  | { type: "icon"; icon: string; label?: string }
  | { type: "postCollection"; sourceScopeKey: string; query: Record<string, unknown> };

export interface BuilderRegionDefinition {
  id: string;
  kind: EditableKind;
  label?: string;
  required?: boolean;
}

export type BuilderRegionInput = string | BuilderRegionDefinition;

export interface BuilderPage {
  path: string;
  label: string;
  regions: BuilderRegionInput[];
}

export interface AuditEvent {
  id: string;
  siteId: string;
  pagePath: string;
  action: string;
  userId: string;
  userLabel?: string;
  createdAt: string;
  summary: string;
  regionId?: string;
  kind?: EditableKind;
  before?: EditableValue | null;
  after?: EditableValue | null;
  versionId?: string;
  sourceVersionId?: string;
  resultVersionId?: string;
  entryId?: string;
  actorEmail?: string;
  correlationId?: string;
  contentBefore?: unknown;
  contentAfter?: unknown;
}

export interface MediaAsset {
  id: string;
  siteId: string;
  path: string;
  url: string;
  alt: string;
  label: string;
  mimeType: string;
  source: "seed" | "upload";
  width?: number;
  height?: number;
  userId: string;
  createdAt: string;
}

export type BuilderPreviewMessage =
  | {
      type: "builder:select-entry";
      siteId: string;
      pagePath: string;
      entryId: string;
      regionId?: string;
      anchor?: { x: number; y: number };
    }
  | {
      type: "builder:preview-ready";
      siteId: string;
      pagePath: string;
    };

export function isBuilderPreviewMessage(value: unknown, siteId?: string): value is BuilderPreviewMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<BuilderPreviewMessage>;
  if (message.type !== "builder:select-entry" && message.type !== "builder:preview-ready") return false;
  if (typeof message.siteId !== "string" || typeof message.pagePath !== "string") return false;
  if (siteId && message.siteId !== siteId) return false;
  if (message.type === "builder:select-entry" && typeof message.entryId !== "string") return false;
  return true;
}
