"use client";

import {
  type ChangeEvent,
  FormEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { editorMediaAssets } from "@/generated/editor-media-assets";
import { editorPostPlaceholders } from "@/generated/editor-posts";

type EditableKind = "text" | "image" | "link";

type StoredEdit =
  | { kind: "text"; text: string; html?: string; textShadow?: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "link"; text: string; href: string; html?: string; textShadow?: string; boxShadow?: string };

type MenuState = {
  key: string;
  kind: EditableKind;
  x: number;
  y: number;
  text: string;
  html: string;
  href: string;
  linkUrl: string;
  textColor: string;
  highlightColor: string;
  textShadow: string;
  buttonBoxShadow: string;
  src: string;
  alt: string;
};

type ImageTargetState = {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

type MediaAsset = {
  id: string;
  src: string;
  alt: string;
  label: string;
  mimeType: string;
  path?: string;
  source: "seed" | "upload";
};

type EditorPost = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published" | "archived";
  excerpt: string;
  imagePath: string;
  source: "site-scan" | "manual";
  sourcePagePath: string;
  linkedRegionIds: readonly string[];
};

type SelectedRegionBinding = {
  key: string;
  kind: EditableKind;
  label: string;
};

type LinkPanelState = {
  x: number;
  y: number;
  url: string;
  pagePath: string;
  postId: string;
};

type AuditEvent = {
  id: string;
  action: "save" | "rollback";
  pagePath: string;
  regionKey: string;
  kind: EditableKind;
  changedAt: string;
  oldValue: StoredEdit | null;
  newValue: StoredEdit | null;
  summary: string;
  userLabel: string;
};

const editStoragePrefix = "campaign-v1-static-editor";
const editorSessionKey = "campaign-v1-static-editor-active";
const historyStorageKey = `${editStoragePrefix}:history`;
const historyMessageType = `${editStoragePrefix}:history-updated`;
const historyRequestMessageType = `${editStoragePrefix}:history-request`;
const historyRollbackRequestMessageType = `${editStoragePrefix}:rollback-request`;
const favoriteMediaStorageKey = "campaign-v1-editor:favorite-media";
const postsStorageKey = "campaign-v1-editor:posts";
const linkStorageKey = `${editStoragePrefix}:links`;
const editSelector =
  "main h1, main h2, main h3, main p, main blockquote, main a, main button, main time, main strong, main small, main span, footer p, footer a, header a, header nav a, img";

const staticGalleryAssets: MediaAsset[] = [
  {
    id: "seed:carmen-statehouse-leaders",
    src: "/images/campaign/carmen-statehouse-leaders.jpg",
    alt: "Carmen Morales standing with state leaders in an official State House setting.",
    label: "State House leaders",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:student-champions-assembly",
    src: "/images/campaign/student-champions-assembly.jpg",
    alt: "Students and community leaders recognized inside the Assembly chamber.",
    label: "Student champions",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:community-table-outreach",
    src: "/images/campaign/community-table-outreach.jpg",
    alt: "Campaign supporters greeting neighbors at an outdoor community table.",
    label: "Community outreach",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-with-community-leaders",
    src: "/images/campaign/carmen-with-community-leaders.jpg",
    alt: "Carmen Morales standing with community leaders at a local gathering.",
    label: "Community leaders",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-family-community",
    src: "/images/campaign/carmen-family-community.jpg",
    alt: "Carmen Morales connecting with a family at a community event.",
    label: "Family community event",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:education-graduation-continued",
    src: "/images/campaign/education-graduation-continued.jpg",
    alt: "A graduate facing a full stadium with a decorated cap about continuing forward.",
    label: "Education graduation",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:roundtable-listening-session",
    src: "/images/campaign/roundtable-listening-session.jpg",
    alt: "Residents and organizers gathered for a roundtable listening session.",
    label: "Listening session",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:bloomfield-community-visit",
    src: "/images/campaign/bloomfield-community-visit.jpg",
    alt: "Carmen Morales visiting with Bloomfield community members outdoors.",
    label: "Bloomfield visit",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:coffee-shop-event",
    src: "/images/campaign/coffee-shop-event.jpg",
    alt: "Community members gathered inside a coffee shop for a campaign event.",
    label: "Coffee shop event",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:podium-events-venue",
    src: "/images/campaign/podium-events-venue.jpg",
    alt: "A campaign event podium set up inside an event venue.",
    label: "Event podium",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:campaign-office-briefing",
    src: "/images/campaign/campaign-office-briefing.jpg",
    alt: "Campaign supporters attending a briefing inside a campaign office.",
    label: "Office briefing",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:local-endorsement-team",
    src: "/images/campaign/local-endorsement-team.jpg",
    alt: "Local supporters standing together with campaign signs.",
    label: "Endorsement team",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:community-supporters-venue",
    src: "/images/campaign/community-supporters-venue.jpg",
    alt: "Community supporters gathered together at a local venue.",
    label: "Supporters venue",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-neighborhood-conversation",
    src: "/images/campaign/carmen-neighborhood-conversation.jpg",
    alt: "Carmen Morales speaking with neighbors during a community conversation.",
    label: "Neighborhood talk",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:volunteer-team-morales",
    src: "/images/campaign/volunteer-team-morales.jpg",
    alt: "A Morales campaign volunteer recruitment graphic with team photos.",
    label: "Volunteer team",
    mimeType: "image/jpeg",
    source: "seed",
  },
  {
    id: "seed:carmen-officials-chamber",
    src: "/images/campaign/carmen-officials-chamber.jpg",
    alt: "Carmen Morales with public officials inside a formal chamber.",
    label: "Officials chamber",
    mimeType: "image/jpeg",
    source: "seed",
  },
];

const pageOptions = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Issues", path: "/issues" },
  { label: "Events", path: "/events" },
  { label: "Endorsements", path: "/endorsements" },
  { label: "News", path: "/news" },
  { label: "Contact", path: "/contact" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Donate", path: "/donate" },
];

const projectGalleryAssets: MediaAsset[] = editorMediaAssets.map((asset) => ({
  id: asset.id,
  src: asset.path,
  alt: asset.alt,
  label: asset.label,
  mimeType: asset.mimeType,
  path: asset.path,
  source: "seed",
}));

function siteBasePath() {
  return window.location.pathname.startsWith("/Campaign-Website-V1") ? "/Campaign-Website-V1" : "";
}

function readFavoriteMediaIds() {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const ids = JSON.parse(window.localStorage.getItem(favoriteMediaStorageKey) ?? "[]") as string[];
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set<string>();
  }
}

function writeFavoriteMediaIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(favoriteMediaStorageKey, JSON.stringify(Array.from(ids)));
}

function readStoredPosts(): EditorPost[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(postsStorageKey) ?? "[]") as EditorPost[];
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function writeStoredPosts(posts: EditorPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(postsStorageKey, JSON.stringify(posts));
  window.parent.postMessage({ type: "campaign-v1-editor:posts-updated" }, window.location.origin);
}

function readLinkBindings(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(window.localStorage.getItem(linkStorageKey) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writeLinkBindings(bindings: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(linkStorageKey, JSON.stringify(bindings));
}

function regionLabel(element: HTMLElement) {
  if (element instanceof HTMLImageElement) return element.alt || "Image";
  return element.textContent?.trim().slice(0, 64) || element.dataset.demoEditableKey || "Selected content";
}

function withSiteBasePath(src: string) {
  if (!src || /^(https?:|data:|blob:)/.test(src)) return src;
  const base = siteBasePath();
  if (!base || !src.startsWith("/") || src.startsWith(`${base}/`)) return src;
  return `${base}${src}`;
}

function normalizedPath() {
  const base = siteBasePath();
  const fullPath = window.location.pathname.replace(/\/$/, "") || "/";
  const path = base && fullPath.startsWith(base) ? fullPath.slice(base.length) || "/" : fullPath;
  return path.endsWith("/admin/editor") ? "/" : path;
}

function navigateToPage(path: string) {
  const base = siteBasePath();
  window.location.href = `${base}${path === "/" ? "/" : `${path}/`}`;
}

function storageKey() {
  return storageKeyForPath(normalizedPath());
}

function storageKeyForPath(pagePath: string) {
  return `${editStoragePrefix}:${pagePath}`;
}

function readEditsForPath(pagePath: string): Record<string, StoredEdit> {
  try {
    return JSON.parse(window.localStorage.getItem(storageKeyForPath(pagePath)) ?? "{}") as Record<string, StoredEdit>;
  } catch {
    return {};
  }
}

function readEdits(): Record<string, StoredEdit> {
  return readEditsForPath(normalizedPath());
}

function writeEditForPath(pagePath: string, key: string, edit: StoredEdit | null) {
  const edits = readEditsForPath(pagePath);
  if (edit) {
    edits[key] = edit;
  } else {
    delete edits[key];
  }

  window.localStorage.setItem(storageKeyForPath(pagePath), JSON.stringify(edits));
}

function writeEdit(key: string, edit: StoredEdit) {
  writeEditForPath(normalizedPath(), key, edit);
}

function readAuditLog(): AuditEvent[] {
  try {
    return JSON.parse(window.localStorage.getItem(historyStorageKey) ?? "[]") as AuditEvent[];
  } catch {
    return [];
  }
}

function appendAuditEvent(event: AuditEvent) {
  const events = [event, ...readAuditLog()].slice(0, 100);
  window.localStorage.setItem(historyStorageKey, JSON.stringify(events));
  notifyParentOfAuditEvents(events);
  return events;
}

function notifyParentOfAuditEvents(events: AuditEvent[]) {
  if (window.parent === window) return;
  window.parent.postMessage({ type: historyMessageType, events }, window.location.origin);
}

function editSummary(edit: StoredEdit | null) {
  if (!edit) return "No previous saved value";
  if (edit.kind === "image") return `${edit.src} | alt: ${edit.alt}`;
  if (edit.kind === "link") return `${edit.text} -> ${edit.href}`;
  return edit.text;
}

function elementEditValue(element: HTMLElement, kind: EditableKind): StoredEdit {
  if (kind === "image" && element instanceof HTMLImageElement) {
    return { kind: "image", src: element.getAttribute("src") ?? "", alt: element.alt };
  }

  if (kind === "link") {
    return {
      kind: "link",
      text: element.textContent?.trim() ?? "",
      html: element.innerHTML,
      href: element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "",
      textShadow: element.style.textShadow,
      boxShadow: element.style.boxShadow,
    };
  }

  return { kind: "text", text: element.textContent?.trim() ?? "", html: element.innerHTML, textShadow: element.style.textShadow };
}

function makeAuditEvent(input: Omit<AuditEvent, "id" | "changedAt" | "summary" | "userLabel">): AuditEvent {
  const actionLabel = input.action === "rollback" ? "Rolled back" : "Changed";

  return {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    changedAt: new Date().toISOString(),
    summary: `${actionLabel} ${input.kind} on ${input.pagePath}`,
    userLabel: "Demo admin",
  };
}

function elementKind(element: Element): EditableKind {
  if (element.tagName === "IMG") return "image";
  if (element.tagName === "A" || element.tagName === "BUTTON") return "link";
  return "text";
}

function editableElements() {
  const stableRegions = Array.from(document.querySelectorAll<HTMLElement>("[data-builder-region]")).filter((element) => {
    if (element.closest(".demo-editor-ui")) return false;
    if (element.closest(".mobile-bottom-nav")) return false;
    if (element.matches("script, style, noscript")) return false;
    if (element.dataset.builderKind !== "image" && !element.textContent?.trim()) return false;
    return true;
  });

  if (stableRegions.length > 0) return stableRegions;

  return Array.from(document.querySelectorAll<HTMLElement>(editSelector)).filter((element) => {
    if (element.closest(".demo-editor-ui")) return false;
    if (element.closest(".mobile-bottom-nav")) return false;
    if (element.matches("script, style, noscript")) return false;
    if (element.tagName !== "IMG" && !element.textContent?.trim()) return false;
    return true;
  });
}

function assignEditableKeys() {
  const counts = new Map<string, number>();

  editableElements().forEach((element) => {
    const stableRegion = element.dataset.builderRegion;
    const stableKind = element.dataset.builderKind as EditableKind | undefined;
    if (stableRegion && stableKind) {
      element.dataset.demoEditableKey = stableRegion;
      element.dataset.demoEditableKind = stableKind;
      return;
    }

    const kind = elementKind(element);
    const base = `${normalizedPath()}:${kind}:${element.tagName.toLowerCase()}`;
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    element.dataset.demoEditableKey = `${base}:${count}`;
    element.dataset.demoEditableKind = kind;
  });
}

function applyStoredEdits() {
  const edits = readEdits();
  assignEditableKeys();

  editableElements().forEach((element) => {
    const key = element.dataset.demoEditableKey;
    if (!key) return;
    const edit = edits[key];
    if (!edit) return;

    if (edit.kind === "text") {
      if (edit.html) element.innerHTML = edit.html;
      else element.textContent = edit.text;
      element.style.textShadow = edit.textShadow ?? "";
    }

    if (edit.kind === "link") {
      if (edit.html) element.innerHTML = edit.html;
      else element.textContent = edit.text;
      element.style.textShadow = edit.textShadow ?? "";
      element.style.boxShadow = edit.boxShadow ?? "";
      if (element instanceof HTMLAnchorElement) {
        element.href = edit.href;
      }
    }

    if (edit.kind === "image" && element instanceof HTMLImageElement) {
      element.removeAttribute("srcset");
      element.src = withSiteBasePath(edit.src);
      element.alt = edit.alt;
    }
  });
  applyLinkBindings();
}

function applyLinkBindings() {
  const bindings = readLinkBindings();

  editableElements().forEach((element) => {
    const key = element.dataset.demoEditableKey;
    if (!key) return;
    const href = bindings[key];
    element.classList.toggle("demo-selected-link-region", Boolean(href));
    if (!href) {
      delete element.dataset.demoLinkedHref;
      return;
    }

    element.dataset.demoLinkedHref = href;
    if (element instanceof HTMLAnchorElement) {
      element.setAttribute("href", href);
    }
  });
}

function clearBrowserTextSelection() {
  window.getSelection()?.removeAllRanges();
}

function preventEditorTextSelection(event: Event) {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target || target.closest(".demo-editor-ui")) return;

  if (target.closest(".site-header, .page-shell, .site-footer, [data-demo-editable-key], .demo-editable-target")) {
    event.preventDefault();
    clearBrowserTextSelection();
  }
}

export function StaticSiteEditor() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [imageTargets, setImageTargets] = useState<ImageTargetState[]>([]);
  const [uploadedGalleryAssets, setUploadedGalleryAssets] = useState<MediaAsset[]>([]);
  const [favoriteMediaIds, setFavoriteMediaIds] = useState<Set<string>>(() => readFavoriteMediaIds());
  const [selectedRegions, setSelectedRegions] = useState<SelectedRegionBinding[]>([]);
  const [linkPanel, setLinkPanel] = useState<LinkPanelState | null>(null);
  const [createdPosts, setCreatedPosts] = useState<EditorPost[]>(() => readStoredPosts());
  const [status, setStatus] = useState("Demo edits save in this browser only.");
  const selectedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const linkPanelRef = useRef<HTMLDivElement | null>(null);
  const richTextRef = useRef<HTMLDivElement | null>(null);
  const richSelectionRef = useRef<Range | null>(null);
  const pointerMenuActionHandled = useRef(false);
  const selectedRegionsRef = useRef<SelectedRegionBinding[]>([]);
  const galleryAssets = useMemo(() => {
    const merged = [...uploadedGalleryAssets, ...projectGalleryAssets, ...staticGalleryAssets];
    const uniqueAssets = merged.filter((asset, index, assets) => assets.findIndex((item) => item.src === asset.src) === index);
    return uniqueAssets.sort((a, b) => Number(favoriteMediaIds.has(b.id)) - Number(favoriteMediaIds.has(a.id)));
  }, [favoriteMediaIds, uploadedGalleryAssets]);
  const availablePosts = useMemo(() => {
    const storedIds = new Set(createdPosts.map((post) => post.id));
    return [
      ...createdPosts,
      ...editorPostPlaceholders.filter((post) => !storedIds.has(post.id)),
    ] as EditorPost[];
  }, [createdPosts]);

  useEffect(() => {
    function respondWithAuditLog(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const message = event.data as { type?: unknown; eventId?: unknown };
      if (message.type === historyRequestMessageType) {
        notifyParentOfAuditEvents(readAuditLog());
      }
      if (message.type === historyRollbackRequestMessageType && typeof message.eventId === "string") {
        const targetEvent = readAuditLog().find((eventItem) => eventItem.id === message.eventId);
        if (targetEvent) rollbackAuditEvent(targetEvent);
      }
    }

    window.addEventListener("message", respondWithAuditLog);
    return () => window.removeEventListener("message", respondWithAuditLog);
  }, []);

  useEffect(() => {
    selectedRegionsRef.current = selectedRegions;
  }, [selectedRegions]);

  function openMenuForElement(element: HTMLElement, clientX: number, clientY: number) {
    const kind = element.dataset.demoEditableKind as EditableKind | undefined;
    const key = element.dataset.demoEditableKey;
    if (!kind || !key) return;

    clearActiveEditRegion();
    clearSelectedRegionOutlines(selectedRegionsRef.current);
    setSelectedRegions([]);
    setLinkPanel(null);
    setGalleryOpen(false);
    selectedElement.current = element;
    element.classList.add("demo-active-edit-region");
    setMenu({
      key,
      kind,
      x: Math.min(clientX, window.innerWidth - 340),
      y: Math.min(clientY, window.innerHeight - 260),
      text: element.textContent?.trim() ?? "",
      html: element.innerHTML,
      href: element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "" : "",
      linkUrl: element instanceof HTMLAnchorElement ? element.getAttribute("href") ?? "https://" : "https://",
      textColor: "#111827",
      highlightColor: "#fef3c7",
      textShadow: element.style.textShadow,
      buttonBoxShadow: element.style.boxShadow,
      src: element instanceof HTMLImageElement ? element.getAttribute("src") ?? "" : "",
      alt: element instanceof HTMLImageElement ? element.alt : "",
    });
  }

  function openImageTarget(key: string, x: number, y: number) {
    const element = document.querySelector<HTMLElement>(`[data-demo-editable-key="${CSS.escape(key)}"]`);
    if (element) {
      openMenuForElement(element, x, y);
    }
  }

  function clearActiveEditRegion() {
    const element = selectedElement.current;
    if (element) element.classList.remove("demo-active-edit-region");
    selectedElement.current = null;
  }

  function clearSelectedRegionOutlines(regions: SelectedRegionBinding[] = selectedRegionsRef.current) {
    regions.forEach((region) => {
      const element = document.querySelector<HTMLElement>(`[data-demo-editable-key="${CSS.escape(region.key)}"]`);
      if (!element?.dataset.demoLinkedHref) {
        element?.classList.remove("demo-selected-link-region");
      }
    });
  }

  function clearOpenEditorMenus() {
    clearSelectedRegionOutlines(selectedRegionsRef.current);
    clearActiveEditRegion();
    setMenu(null);
    setGalleryOpen(false);
    setLinkPanel(null);
    setSelectedRegions([]);
  }

  function toggleRegionSelection(element: HTMLElement, clientX: number, clientY: number) {
    const key = element.dataset.demoEditableKey;
    const kind = element.dataset.demoEditableKind as EditableKind | undefined;
    if (!key || !kind) return;

    clearActiveEditRegion();
    setMenu(null);
    setGalleryOpen(false);
    setSelectedRegions((current) => {
      const exists = current.some((region) => region.key === key);
      const nextSelectedRegions = exists
        ? current.filter((region) => region.key !== key)
        : [...current, { key, kind, label: regionLabel(element) }];
      if (exists && !element.dataset.demoLinkedHref) {
        element.classList.remove("demo-selected-link-region");
      } else if (!exists) {
        element.classList.add("demo-selected-link-region");
      }

      if (nextSelectedRegions.length < 2) {
        setLinkPanel(null);
        setStatus("Select one more area to link multiple items together.");
      } else {
        setLinkPanel({
          x: Math.min(clientX + 18, window.innerWidth - 360),
          y: Math.min(clientY + 18, window.innerHeight - 360),
          url: "https://",
          pagePath: pageOptions[0]?.path ?? "/",
          postId: availablePosts[0]?.id ?? "",
        });
        setStatus("Selected areas are ready to link. Choose a destination in the linking panel.");
      }

      return nextSelectedRegions;
    });
  }

  function linkSelectionToTarget(href: string) {
    if (!href || selectedRegions.length === 0) return;
    const bindings = readLinkBindings();
    selectedRegions.forEach((region) => {
      bindings[region.key] = href;
      const element = document.querySelector<HTMLElement>(`[data-demo-editable-key="${CSS.escape(region.key)}"]`);
      if (!element) return;
      element.dataset.demoLinkedHref = href;
      element.classList.add("demo-selected-link-region");
      if (element instanceof HTMLAnchorElement) element.setAttribute("href", href);
    });
    writeLinkBindings(bindings);
    setStatus(`Linked ${selectedRegions.length} selected area${selectedRegions.length === 1 ? "" : "s"}.`);
    setSelectedRegions([]);
    setLinkPanel(null);
  }

  function createPostFromSelection() {
    const title = selectedRegions[0]?.label || "New linked post";
    const id = `manual-post-${Date.now()}`;
    const post: EditorPost = {
      id,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || id,
      status: "draft",
      excerpt: `Draft post created from ${selectedRegions.length} selected page area${selectedRegions.length === 1 ? "" : "s"}.`,
      imagePath: "",
      source: "manual",
      sourcePagePath: normalizedPath(),
      linkedRegionIds: selectedRegions.map((region) => region.key),
    };
    const nextPosts = [post, ...readStoredPosts().filter((item) => item.id !== post.id)];
    writeStoredPosts(nextPosts);
    setCreatedPosts(nextPosts);
    linkSelectionToTarget(`/news#${post.id}`);
    setStatus(`Created post "${post.title}" and linked the selected areas.`);
  }

  function toggleFavoriteMedia(assetId: string) {
    setFavoriteMediaIds((current) => {
      const next = new Set(current);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      writeFavoriteMediaIds(next);
      return next;
    });
  }

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    const isPreviewFrame = searchParams.get("builderPreview") === "1";
    const isEditorRoute = currentUrl.pathname.endsWith("/admin/editor") || currentUrl.pathname.endsWith("/admin/editor/");

    if (searchParams.get("builderExit") === "1") {
      window.sessionStorage.removeItem(editorSessionKey);
    }
    if (isEditorRoute && !isPreviewFrame) return;
    if (isPreviewFrame) {
      document.body.classList.add("builder-preview-frame");
      setActive(true);
      setStatus("Demo editor active. Click text or images to edit.");
    }

    applyStoredEdits();
    setAuditEvents(readAuditLog());
    let timeout: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(applyStoredEdits, 60);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function openLogin() {
      setLoginOpen(true);
    }

    if (!isPreviewFrame && !isEditorRoute && window.sessionStorage.getItem(editorSessionKey) === "true") {
      window.location.assign(`${siteBasePath()}/admin/editor/`);
    }

    window.addEventListener("campaign-editor:open-login", openLogin);
    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      document.body.classList.remove("builder-preview-frame");
      window.removeEventListener("campaign-editor:open-login", openLogin);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("demo-editor-active", active);
    if (!active) {
      clearActiveEditRegion();
      setMenu(null);
      setGalleryOpen(false);
      setHistoryOpen(false);
      setImageTargets([]);
      setSelectedRegions([]);
      setLinkPanel(null);
      return;
    }

    applyStoredEdits();
    document.querySelectorAll<HTMLElement>("[data-demo-editable-key]").forEach((element) => {
      element.classList.add("demo-editable-target");
      element.classList.add(
        element.dataset.demoEditableKind === "image" ? "demo-editable-image-target" : "demo-editable-text-target",
      );
      element.tabIndex = element.tabIndex < 0 ? 0 : element.tabIndex;
      element.title =
        element.dataset.demoEditableKind === "image"
          ? "Click to edit this image"
          : "Click to edit this content";
    });

    function refreshImageTargets() {
      const toolbarBottom =
        document.querySelector<HTMLElement>(".demo-editor-toolbar")?.getBoundingClientRect().bottom ?? 88;
      const editorViewportTop = toolbarBottom + 8;
      const viewportInset = 8;

      setImageTargets(
        Array.from(document.querySelectorAll<HTMLImageElement>('[data-demo-editable-kind="image"]'))
          .map((element) => {
            const key = element.dataset.demoEditableKey;
            const rect = element.getBoundingClientRect();
            const visibleLeft = Math.max(viewportInset, rect.left);
            const visibleTop = Math.max(editorViewportTop, rect.top);
            const visibleRight = Math.min(window.innerWidth - viewportInset, rect.right);
            const visibleBottom = Math.min(window.innerHeight - viewportInset, rect.bottom);
            const visibleWidth = visibleRight - visibleLeft;
            const visibleHeight = visibleBottom - visibleTop;

            if (!key || visibleRight <= visibleLeft || visibleBottom <= visibleTop) return null;
            if (visibleWidth < 24 || visibleHeight < 24) return null;

            return {
              key,
              x: visibleLeft,
              y: visibleTop,
              width: visibleWidth,
              height: visibleHeight,
              label: element.alt || "Image",
            };
          })
          .filter((target): target is ImageTargetState => target !== null),
      );
    }

    refreshImageTargets();

    function onPointer(event: MouseEvent) {
      const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-demo-editable-key]") : null;
      const clickedInsideEditorUi = event.target instanceof HTMLElement && event.target.closest(".demo-editor-ui");
      if (clickedInsideEditorUi) return;
      if (!target) {
        clearOpenEditorMenus();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      clearBrowserTextSelection();
      if (event.shiftKey) {
        toggleRegionSelection(target, event.clientX, event.clientY);
        return;
      }
      openMenuForElement(target, event.clientX, event.clientY);
    }

    function blockNavigation(event: MouseEvent) {
      const anchor = event.target instanceof HTMLElement ? event.target.closest("a") : null;
      if (anchor && anchor.closest("[data-demo-editable-key]")) {
        event.preventDefault();
      }
    }

    document.addEventListener("click", blockNavigation, true);
    document.addEventListener("click", onPointer, true);
    document.addEventListener("dblclick", onPointer, true);
    document.addEventListener("selectstart", preventEditorTextSelection, true);
    window.addEventListener("resize", refreshImageTargets);
    window.addEventListener("scroll", refreshImageTargets, true);

    return () => {
      document.body.classList.remove("demo-editor-active");
      document.removeEventListener("click", blockNavigation, true);
      document.removeEventListener("click", onPointer, true);
      document.removeEventListener("dblclick", onPointer, true);
      document.removeEventListener("selectstart", preventEditorTextSelection, true);
      window.removeEventListener("resize", refreshImageTargets);
      window.removeEventListener("scroll", refreshImageTargets, true);
      setImageTargets([]);
      document.querySelectorAll<HTMLElement>(".demo-editable-target").forEach((element) => {
        element.classList.remove("demo-editable-target");
        element.classList.remove("demo-editable-image-target");
        element.classList.remove("demo-editable-text-target");
        element.classList.remove("demo-selected-link-region");
        element.classList.remove("demo-active-edit-region");
        element.removeAttribute("title");
      });
    };
  }, [active, availablePosts]);

  useEffect(() => {
    if (!menu || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const nextX = Math.max(12, Math.min(menu.x, window.innerWidth - rect.width - 12));
    const nextY = Math.max(12, Math.min(menu.y, window.innerHeight - rect.height - 12));

    if (Math.abs(nextX - menu.x) > 1 || Math.abs(nextY - menu.y) > 1) {
      setMenu({ ...menu, x: nextX, y: nextY });
    }
  }, [menu]);

  useEffect(() => {
    if (!linkPanel || !linkPanelRef.current) return;

    const rect = linkPanelRef.current.getBoundingClientRect();
    const nextX = Math.max(12, Math.min(linkPanel.x, window.innerWidth - rect.width - 12));
    const nextY = Math.max(12, Math.min(linkPanel.y, window.innerHeight - rect.height - 12));

    if (Math.abs(nextX - linkPanel.x) > 1 || Math.abs(nextY - linkPanel.y) > 1) {
      setLinkPanel({ ...linkPanel, x: nextX, y: nextY });
    }
  }, [linkPanel]);

  function enterEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.sessionStorage.setItem(editorSessionKey, "true");
    setLoginOpen(false);
    window.location.assign(`${siteBasePath()}/admin/editor/`);
  }

  function closeLoginFromBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setLoginOpen(false);
    }
  }

  function exitEditor() {
    window.sessionStorage.removeItem(editorSessionKey);
    setActive(false);
  }

  function syncRichTextFromEditor() {
    if (!menu || !richTextRef.current) return;
    setMenu({ ...menu, html: richTextRef.current.innerHTML, text: richTextRef.current.innerText.trim() });
  }

  function rememberRichTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !richTextRef.current) return;

    const range = selection.getRangeAt(0);
    if (richTextRef.current.contains(range.commonAncestorContainer)) {
      richSelectionRef.current = range.cloneRange();
    }
  }

  function restoreRichTextSelection() {
    richTextRef.current?.focus();
    const selection = window.getSelection();
    if (!selection || !richSelectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(richSelectionRef.current);
  }

  function applyRichTextCommand(command: string, value?: string) {
    restoreRichTextSelection();
    document.execCommand(command, false, value);
    syncRichTextFromEditor();
    rememberRichTextSelection();
  }

  function updateMenuStyle(next: Partial<Pick<MenuState, "textShadow" | "buttonBoxShadow" | "textColor" | "highlightColor" | "linkUrl">>) {
    if (!menu) return;
    setMenu({ ...menu, ...next });
  }

  function saveMenuEdit() {
    if (!menu || !selectedElement.current) return;
    const element = selectedElement.current;
    const pagePath = normalizedPath();
    const oldValue = elementEditValue(element, menu.kind);
    let newValue: StoredEdit | null = null;
    const richHtml = richTextRef.current?.innerHTML ?? menu.html;
    const richText = richTextRef.current?.innerText.trim() ?? menu.text;

    if (menu.kind === "text") {
      element.innerHTML = richHtml;
      element.style.textShadow = menu.textShadow;
      newValue = { kind: "text", text: richText, html: richHtml, textShadow: menu.textShadow };
      writeEdit(menu.key, newValue);
    }

    if (menu.kind === "link") {
      element.innerHTML = richHtml;
      element.style.textShadow = menu.textShadow;
      element.style.boxShadow = menu.buttonBoxShadow;
      if (element instanceof HTMLAnchorElement) {
        element.href = menu.href;
      }
      newValue = {
        kind: "link",
        text: richText,
        html: richHtml,
        href: menu.href,
        textShadow: menu.textShadow,
        boxShadow: menu.buttonBoxShadow,
      };
      writeEdit(menu.key, newValue);
    }

    if (menu.kind === "image" && element instanceof HTMLImageElement) {
      element.removeAttribute("srcset");
      element.src = withSiteBasePath(menu.src);
      element.alt = menu.alt;
      newValue = { kind: "image", src: menu.src, alt: menu.alt };
      writeEdit(menu.key, newValue);
    }

    if (newValue) {
      setAuditEvents(
        appendAuditEvent(
          makeAuditEvent({
            action: "save",
            pagePath,
            regionKey: menu.key,
            kind: menu.kind,
            oldValue,
            newValue,
          }),
        ),
      );
    }

    setStatus("Demo edit saved locally. It will remain in this browser until cleared.");
    setGalleryOpen(false);
    clearActiveEditRegion();
    setMenu(null);
  }

  function saveMenuEditFromPointer(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    pointerMenuActionHandled.current = true;
    saveMenuEdit();
    window.setTimeout(() => {
      pointerMenuActionHandled.current = false;
    }, 0);
  }

  function saveMenuEditFromClick() {
    if (pointerMenuActionHandled.current) return;
    saveMenuEdit();
  }

  function clearEdits() {
    window.localStorage.removeItem(storageKey());
    window.location.reload();
  }

  function rollbackAuditEvent(event: AuditEvent) {
    writeEditForPath(event.pagePath, event.regionKey, event.oldValue);
    const rollbackEvent = makeAuditEvent({
      action: "rollback",
      pagePath: event.pagePath,
      regionKey: event.regionKey,
      kind: event.kind,
      oldValue: event.newValue,
      newValue: event.oldValue,
    });

    setAuditEvents(appendAuditEvent(rollbackEvent));
    setStatus(`Rolled back ${event.kind} change from ${new Date(event.changedAt).toLocaleString()}.`);

    if (event.pagePath === normalizedPath()) {
      applyStoredEdits();
    }
  }

  function selectGalleryAsset(asset: MediaAsset) {
    if (!menu || menu.kind !== "image") return;

    setMenu({ ...menu, src: asset.src, alt: asset.alt });
    setGalleryOpen(false);
    setStatus(
      asset.source === "upload"
        ? `Selected uploaded image: ${asset.label}. Save locally to apply.`
        : `Selected gallery image: ${asset.label}. Save locally to apply.`,
    );
  }

  function uploadGalleryAsset(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("Choose an image file such as PNG, JPEG, GIF, WebP, or SVG.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        setStatus("That image could not be loaded in the demo editor.");
        return;
      }

      const asset: MediaAsset = {
        id: `upload:${file.name}:${file.lastModified}`,
        src,
        alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        label: file.name,
        mimeType: file.type || "image/*",
        source: "upload",
      };

      setUploadedGalleryAssets((assets) => [asset, ...assets.filter((item) => item.id !== asset.id)]);
      setMenu((current) => (current?.kind === "image" ? { ...current, src: asset.src, alt: asset.alt } : current));
      setStatus(`Uploaded ${file.name}. Save locally to apply this image.`);
    };
    reader.readAsDataURL(file);
  }

  function closeGalleryFromBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setGalleryOpen(false);
    }
  }

  function closeHistoryFromBackdrop(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setHistoryOpen(false);
    }
  }

  function renderHistoryValue(edit: StoredEdit | null, label: string) {
    if (!edit) return <span>No previous saved value</span>;

    if (edit.kind === "image") {
      return (
        <div className="demo-history-image-preview">
          <img src={withSiteBasePath(edit.src)} alt={`${label} image preview`} />
          <p>{editSummary(edit)}</p>
        </div>
      );
    }

    return <span>{editSummary(edit)}</span>;
  }

  function formatRegionLabel(regionKey: string) {
    const parts = regionKey.split(/[.:]/).filter(Boolean).slice(-2);
    return (parts.length ? parts : ["Selected area"])
      .map((part) => part.replace(/[-_]+/g, " "))
      .join(" ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function formatHistoryTitle(event: AuditEvent) {
    const action = event.action === "rollback" ? "Restored" : "Updated";
    return `${action} ${formatRegionLabel(event.regionKey)}`;
  }

  return (
    <>
      {loginOpen ? (
        <div
          className="demo-editor-ui demo-login-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-login-title"
          onMouseDown={closeLoginFromBackdrop}
        >
          <form className="demo-login-modal" onSubmit={enterEditor}>
            <p className="demo-kicker">GitHub Pages demo</p>
            <h2 id="demo-login-title">Sign in to edit the site</h2>
            <p>This preview accepts any email and password. Real client sites will use protected owner accounts.</p>
            <label>
              Email
              <input type="email" name="email" required placeholder="owner@example.com" />
            </label>
            <label>
              Password
              <input type="password" name="password" required placeholder="Demo password" />
            </label>
            <div className="demo-login-actions">
              <button type="button" onClick={() => setLoginOpen(false)}>
                Cancel
              </button>
              <button type="submit">Enter editor</button>
            </div>
          </form>
        </div>
      ) : null}

      {active ? (
        <div className="demo-editor-ui demo-editor-toolbar" aria-live="polite">
          <div>
            <strong>Site editor demo</strong>
            <span>{status}</span>
          </div>
          <label>
            Page
            <select value={normalizedPath()} onChange={(event) => navigateToPage(event.target.value)}>
              {pageOptions.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setHistoryOpen(true)}>
            Change history
          </button>
          <button type="button" onClick={clearEdits}>
            Clear demo edits
          </button>
          <button type="button" onClick={exitEditor}>
            Back to user view
          </button>
        </div>
      ) : null}

      {active
        ? imageTargets.map((target) => (
            <div
              className="demo-editor-ui demo-image-target-layer"
              key={target.key}
              style={{ left: target.x, top: target.y, width: target.width, height: target.height }}
              aria-hidden="true"
            >
              <button
                className="demo-image-target-chip"
                type="button"
                title={target.label}
                onClick={() => openImageTarget(target.key, target.x + 18, target.y + 42)}
              >
                Image
              </button>
            </div>
          ))
        : null}

      {linkPanel && selectedRegions.length > 0 ? (
        <div
          ref={linkPanelRef}
          className="demo-editor-ui demo-multi-select-panel"
          style={{ left: linkPanel.x, top: linkPanel.y, maxHeight: "calc(100vh - 24px)" }}
          role="dialog"
          aria-label="Link selected content"
        >
          <p className="demo-kicker">Link selection</p>
          <strong>{selectedRegions.length} selected area{selectedRegions.length === 1 ? "" : "s"}</strong>
          <div className="demo-selected-region-list">
            {selectedRegions.map((region) => (
              <span key={region.key}>{region.label}</span>
            ))}
          </div>
          <label>
            Link to URL
            <div className="demo-link-row">
              <input
                value={linkPanel.url}
                onChange={(event) => setLinkPanel({ ...linkPanel, url: event.target.value })}
                placeholder="https://example.com"
              />
              <button type="button" onClick={() => linkSelectionToTarget(linkPanel.url)}>
                Apply
              </button>
            </div>
          </label>
          <label>
            Project page
            <div className="demo-link-row">
              <select value={linkPanel.pagePath} onChange={(event) => setLinkPanel({ ...linkPanel, pagePath: event.target.value })}>
                {pageOptions.map((page) => (
                  <option key={page.path} value={page.path}>
                    {page.label}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => linkSelectionToTarget(linkPanel.pagePath)}>
                Apply
              </button>
            </div>
          </label>
          <label>
            Existing post
            <div className="demo-link-row">
              <select value={linkPanel.postId} onChange={(event) => setLinkPanel({ ...linkPanel, postId: event.target.value })}>
                {availablePosts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => linkSelectionToTarget(`/news#${linkPanel.postId}`)}>
                Apply
              </button>
            </div>
          </label>
          <div className="demo-link-actions">
            <button type="button" onClick={createPostFromSelection}>
              Create post
            </button>
            <button
              type="button"
              onClick={() => {
                clearOpenEditorMenus();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {menu ? (
        <div
          ref={menuRef}
          className="demo-editor-ui demo-context-menu"
          style={{ left: menu.x, top: menu.y, maxHeight: "calc(100vh - 24px)" }}
        >
          <p className="demo-kicker">{menu.kind} tools</p>
          {(menu.kind === "text" || menu.kind === "link") && (
            <div className="demo-rich-text-section">
              <span className="demo-field-label">Text</span>
              <div className="demo-rich-text-toolbar" role="toolbar" aria-label="Text formatting">
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyRichTextCommand("bold")}>
                  B
                </button>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyRichTextCommand("italic")}>
                  I
                </button>
                <label title="Text color">
                  <span>Color</span>
                  <input
                    type="color"
                    value={menu.textColor}
                    onChange={(event) => {
                      updateMenuStyle({ textColor: event.target.value });
                      applyRichTextCommand("foreColor", event.target.value);
                    }}
                  />
                </label>
                <label title="Highlight color">
                  <span>Highlight</span>
                  <input
                    type="color"
                    value={menu.highlightColor}
                    onChange={(event) => {
                      updateMenuStyle({ highlightColor: event.target.value });
                      applyRichTextCommand("hiliteColor", event.target.value);
                    }}
                  />
                </label>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyRichTextCommand("createLink", menu.linkUrl)}>
                  Link
                </button>
                <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyRichTextCommand("unlink")}>
                  Unlink
                </button>
              </div>
              <div
                key={menu.key}
                ref={richTextRef}
                className="demo-rich-text-editor"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label="Editable formatted text"
                onInput={() => {
                  syncRichTextFromEditor();
                  rememberRichTextSelection();
                }}
                onMouseUp={rememberRichTextSelection}
                onKeyUp={rememberRichTextSelection}
                dangerouslySetInnerHTML={{ __html: menu.html }}
              />
              <label>
                Link for selected words
                <input value={menu.linkUrl} onChange={(event) => setMenu({ ...menu, linkUrl: event.target.value })} placeholder="https://example.com" />
              </label>
              <div className="demo-style-grid">
                <label>
                  Text shadow
                  <select value={menu.textShadow} onChange={(event) => updateMenuStyle({ textShadow: event.target.value })}>
                    <option value="">None</option>
                    <option value="0 1px 2px rgba(15, 23, 42, 0.28)">Soft</option>
                    <option value="0 2px 8px rgba(15, 23, 42, 0.35)">Medium</option>
                    <option value="0 3px 14px rgba(15, 23, 42, 0.45)">Strong</option>
                  </select>
                </label>
                {menu.kind === "link" ? (
                  <label>
                    Button shadow
                    <select value={menu.buttonBoxShadow} onChange={(event) => updateMenuStyle({ buttonBoxShadow: event.target.value })}>
                      <option value="">None</option>
                      <option value="0 8px 18px rgba(15, 23, 42, 0.16)">Soft</option>
                      <option value="0 12px 28px rgba(15, 23, 42, 0.22)">Lifted</option>
                      <option value="0 16px 38px rgba(187, 0, 31, 0.28)">Campaign glow</option>
                    </select>
                  </label>
                ) : null}
              </div>
            </div>
          )}
          {menu.kind === "link" && (
            <label>
              Link destination
              <input value={menu.href} onChange={(event) => setMenu({ ...menu, href: event.target.value })} />
            </label>
          )}
          {menu.kind === "image" && (
            <>
              <div className="demo-selected-image-preview">
                <img src={withSiteBasePath(menu.src)} alt="" />
                <div>
                  <strong>Selected image</strong>
                  <span>{galleryAssets.find((asset) => asset.src === menu.src)?.label ?? "Current page image"}</span>
                </div>
              </div>
              <label>
                Alt text
                <textarea value={menu.alt} onChange={(event) => setMenu({ ...menu, alt: event.target.value })} />
              </label>
              <div className="demo-gallery-panel">
                <div>
                  <strong>Gallery</strong>
                  <span>Browse all uploaded and demo images in a larger media window.</span>
                </div>
                <button className="demo-gallery-open-button" type="button" onClick={() => setGalleryOpen(true)}>
                  Open gallery
                </button>
                <label className="demo-upload-control">
                  Upload image
                  <input type="file" accept="image/*" onChange={uploadGalleryAsset} />
                </label>
              </div>
              <details className="demo-technical-details">
                <summary>Show technical details</summary>
                <label>
                  Image source
                  <input value={menu.src} onChange={(event) => setMenu({ ...menu, src: event.target.value })} />
                </label>
              </details>
            </>
          )}
          <div className="demo-context-actions">
            <button
              type="button"
              onClick={() => {
                setGalleryOpen(false);
                clearActiveEditRegion();
                setMenu(null);
              }}
            >
              Cancel
            </button>
            <button type="button" onPointerDown={saveMenuEditFromPointer} onClick={saveMenuEditFromClick}>
              Save locally
            </button>
          </div>
        </div>
      ) : null}

      {galleryOpen && menu?.kind === "image" ? (
        <div
          className="demo-editor-ui demo-gallery-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-gallery-title"
          onMouseDown={closeGalleryFromBackdrop}
        >
          <section className="demo-gallery-modal">
            <div className="demo-gallery-modal-header">
              <div>
                <p className="demo-kicker">Media library</p>
                <h2 id="demo-gallery-title">Choose from gallery</h2>
                <span>Demo media now. Backend media records can replace this same asset shape later.</span>
              </div>
              <button type="button" onClick={() => setGalleryOpen(false)}>
                Close
              </button>
            </div>
            <label className="demo-upload-control demo-gallery-upload">
              Upload image
              <input type="file" accept="image/*" onChange={uploadGalleryAsset} />
            </label>
            <div className="demo-gallery-grid">
              {galleryAssets.map((asset) => (
                <article className="demo-gallery-card" key={asset.id} title={`${asset.label} (${asset.mimeType})`}>
                  <button type="button" onClick={() => selectGalleryAsset(asset)}>
                    <img src={withSiteBasePath(asset.src)} alt="" />
                    <span>{asset.label}</span>
                    <small>{asset.source === "upload" ? "Uploaded image" : "Project media"}</small>
                  </button>
                  <button
                    className="demo-favorite-button"
                    type="button"
                    aria-pressed={favoriteMediaIds.has(asset.id)}
                    onClick={() => toggleFavoriteMedia(asset.id)}
                  >
                    {favoriteMediaIds.has(asset.id) ? "Favorited" : "Favorite"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {historyOpen ? (
        <div
          className="demo-editor-ui demo-gallery-backdrop demo-history-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-history-title"
          onMouseDown={closeHistoryFromBackdrop}
        >
          <section className="demo-history-modal">
            <div className="demo-gallery-modal-header">
              <div>
                <p className="demo-kicker">Audit log</p>
                <h2 id="demo-history-title">Change history</h2>
                <span>Every saved demo edit is logged with the page, field, time, before value, and after value.</span>
              </div>
              <button type="button" onClick={() => setHistoryOpen(false)}>
                Close
              </button>
            </div>
            {auditEvents.length === 0 ? (
              <p className="demo-history-empty">No changes have been saved in this browser yet.</p>
            ) : (
              <div className="demo-history-list">
                {auditEvents.map((event) => (
                  <article className="demo-history-event" key={event.id}>
                    <div>
                      <strong>{formatHistoryTitle(event)}</strong>
                      <span>
                        {new Date(event.changedAt).toLocaleString()} by {event.userLabel}
                      </span>
                      <small>{pageOptions.find((page) => page.path === event.pagePath)?.label ?? event.pagePath} page</small>
                    </div>
                    <dl className="demo-history-values">
                      <div>
                        <dt>Before</dt>
                        <dd>{renderHistoryValue(event.oldValue, "Before")}</dd>
                      </div>
                      <div>
                        <dt>After</dt>
                        <dd>{renderHistoryValue(event.newValue, "After")}</dd>
                      </div>
                    </dl>
                    {event.action === "rollback" ? (
                      <div className="demo-history-rollback-actions">
                        <span className="demo-history-rollback-note">Rollback recorded</span>
                        <button className="demo-history-undo-button" type="button" onClick={() => rollbackAuditEvent(event)}>
                          Undo rollback
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => rollbackAuditEvent(event)}>
                        Restore
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
