"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { editorMediaAssets } from "@/generated/editor-media-assets";
import { editorPostPlaceholders } from "@/generated/editor-posts";

type EditorPostStatus = "draft" | "scheduled" | "published" | "archived";

type EditorPost = {
  id: string;
  title: string;
  slug: string;
  status: EditorPostStatus;
  excerpt: string;
  imagePath: string;
  source: "site-scan" | "manual";
  sourcePagePath: string;
  linkedRegionIds: readonly string[];
};

const postsStorageKey = "campaign-v1-editor:posts";

const emptyPost: EditorPost = {
  id: "manual-post",
  title: "Untitled post",
  slug: "untitled-post",
  status: "draft",
  excerpt: "",
  imagePath: "",
  source: "manual",
  sourcePagePath: "/",
  linkedRegionIds: [],
};

function readStoredPosts() {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(postsStorageKey) ?? "[]") as EditorPost[];
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function combinePosts(storedPosts: EditorPost[]) {
  const storedIds = new Set(storedPosts.map((post) => post.id));
  return [
    ...storedPosts,
    ...editorPostPlaceholders.filter((post) => !storedIds.has(post.id)).map((post) => ({ ...post })),
  ];
}

function writeStoredPosts(posts: EditorPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(postsStorageKey, JSON.stringify(posts));
}

function resolvePreviewPath(path: string) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  if (typeof window === "undefined") return path;
  const base = window.location.pathname.startsWith("/Campaign-Website-V1") ? "/Campaign-Website-V1" : "";
  return base && path.startsWith("/") && !path.startsWith(`${base}/`) ? `${base}${path}` : path;
}

function friendlyImageName(path: string) {
  const filename = path.split("/").filter(Boolean).at(-1) ?? "No image selected";
  return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
}

export function EditorPostsWorkspace() {
  const [posts, setPosts] = useState<EditorPost[]>(() => combinePosts(readStoredPosts()));
  const [selectedPostId, setSelectedPostId] = useState(posts[0]?.id ?? "");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0] ?? emptyPost,
    [posts, selectedPostId],
  );
  const selectedImage = useMemo(
    () => editorMediaAssets.find((asset) => asset.path === selectedPost.imagePath),
    [selectedPost.imagePath],
  );

  useEffect(() => {
    function refreshCreatedPosts(event: MessageEvent) {
      const message = event.data as { type?: unknown };
      if (message.type !== "campaign-v1-editor:posts-updated") return;
      setPosts(combinePosts(readStoredPosts()));
    }

    window.addEventListener("message", refreshCreatedPosts);
    return () => window.removeEventListener("message", refreshCreatedPosts);
  }, []);

  function selectPost(postId: string) {
    setSelectedPostId(postId);
  }

  function updateSelectedPost(update: Partial<EditorPost>) {
    setPosts((current) => {
      const nextPosts = current.map((post) => (post.id === selectedPost.id ? { ...post, ...update } : post));
      writeStoredPosts(nextPosts.filter((post) => post.source === "manual"));
      return nextPosts;
    });
  }

  function createPost() {
    const id = `manual-post-${Date.now()}`;
    const post: EditorPost = {
      ...emptyPost,
      id,
      slug: id,
      linkedRegionIds: [],
    };
    setPosts((current) => {
      const nextPosts = [post, ...current];
      writeStoredPosts(nextPosts.filter((item) => item.source === "manual"));
      return nextPosts;
    });
    setSelectedPostId(id);
  }

  function savePost() {
    updateSelectedPost({ title: selectedPost.title.trim() || "Untitled post" });
  }

  return (
    <section data-editor-posts-workspace style={styles.layout}>
      <div style={styles.listPanel}>
        <div style={styles.headerRow}>
          <div>
            <h3 style={styles.heading}>Posts</h3>
            <span style={styles.muted}>{posts.length} post records</span>
          </div>
          <button type="button" onClick={createPost} style={styles.primaryButton}>
            Create post
          </button>
        </div>
        <div style={styles.postList}>
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => selectPost(post.id)}
              style={{
                ...styles.postButton,
                ...(post.id === selectedPost.id ? styles.postButtonActive : null),
              }}
            >
              <strong>{post.title}</strong>
              <span style={styles.muted}>{post.sourcePagePath}</span>
              <span style={styles.status}>{post.source === "site-scan" ? "Scanned starter post" : "Manual post"}</span>
            </button>
          ))}
        </div>
      </div>

      <form
        style={styles.editorPanel}
        onSubmit={(event) => {
          event.preventDefault();
          savePost();
        }}
      >
        <div>
          <span style={styles.status}>{selectedPost.status}</span>
          <h3 style={styles.heading}>{selectedPost.title}</h3>
          <p style={styles.muted}>Source page: {selectedPost.sourcePagePath}</p>
        </div>
        <label style={styles.label}>
          Title
          <input
            value={selectedPost.title}
            onChange={(event) => updateSelectedPost({ title: event.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Slug
          <input
            value={selectedPost.slug}
            onChange={(event) => updateSelectedPost({ slug: event.target.value })}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Summary
          <textarea
            value={selectedPost.excerpt}
            onChange={(event) => updateSelectedPost({ excerpt: event.target.value })}
            style={styles.textarea}
          />
        </label>
        <div style={styles.label}>
          Featured image
          <div style={styles.imagePickerPanel}>
            {selectedPost.imagePath ? (
              <img
                src={resolvePreviewPath(selectedPost.imagePath)}
                alt={selectedImage?.alt ?? friendlyImageName(selectedPost.imagePath)}
                style={styles.imagePreview}
              />
            ) : (
              <div style={styles.imageEmpty}>No image selected</div>
            )}
            <div style={styles.imagePickerText}>
              <strong>{selectedImage?.label ?? friendlyImageName(selectedPost.imagePath)}</strong>
              <span style={styles.muted}>Choose a project image from the shared media library.</span>
              <button type="button" style={styles.secondaryButton} onClick={() => setMediaPickerOpen((open) => !open)}>
                Choose from media library
              </button>
            </div>
          </div>
          <details style={styles.details}>
            <summary>Show full path</summary>
            <input
              aria-label="Post image path"
              value={selectedPost.imagePath}
              onChange={(event) => updateSelectedPost({ imagePath: event.target.value })}
              style={styles.input}
            />
          </details>
          {mediaPickerOpen ? (
            <div style={styles.mediaGrid}>
              {editorMediaAssets.slice(0, 80).map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    updateSelectedPost({ imagePath: asset.path });
                    setMediaPickerOpen(false);
                  }}
                  style={styles.mediaChoice}
                  title={asset.path}
                >
                  <img src={resolvePreviewPath(asset.path)} alt="" style={styles.mediaChoiceImage} />
                  <span>{asset.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div style={styles.linkedPanel}>
          <strong>Linked regions</strong>
          {selectedPost.linkedRegionIds.length > 0 ? (
            <ul style={styles.regionList}>
              {selectedPost.linkedRegionIds.map((regionId) => (
                <li key={regionId}>{regionId}</li>
              ))}
            </ul>
          ) : (
            <p style={styles.muted}>Use Shift + click in the preview to attach text, images, and links to this post.</p>
          )}
        </div>
        <button type="submit" style={styles.primaryButton}>
          Save post
        </button>
      </form>
    </section>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(260px, 340px) minmax(0, 1fr)",
    gap: "18px",
    alignItems: "start",
  },
  listPanel: {
    display: "grid",
    gap: "12px",
    minWidth: 0,
  },
  editorPanel: {
    display: "grid",
    gap: "14px",
    minWidth: 0,
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#fff",
    padding: "16px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  heading: {
    margin: 0,
    fontSize: "20px",
  },
  muted: {
    color: "#667085",
    fontSize: "13px",
  },
  postList: {
    display: "grid",
    gap: "8px",
  },
  postButton: {
    display: "grid",
    gap: "4px",
    width: "100%",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#fff",
    padding: "12px",
    textAlign: "left",
    font: "inherit",
    cursor: "pointer",
    outline: "none",
    transition: "border-color 140ms ease, box-shadow 140ms ease, background 140ms ease",
  },
  postButtonActive: {
    border: "1px solid #2563eb",
    background: "#f8fbff",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.18), 0 12px 28px rgba(37, 99, 235, 0.12)",
  },
  status: {
    color: "#175cd3",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  label: {
    display: "grid",
    gap: "6px",
    color: "#344054",
    fontSize: "13px",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    padding: "10px",
    font: "inherit",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    boxSizing: "border-box",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    padding: "10px",
    font: "inherit",
    resize: "vertical",
  },
  imagePickerPanel: {
    display: "grid",
    gridTemplateColumns: "116px minmax(0, 1fr)",
    gap: "12px",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#f8fafc",
    padding: "10px",
  },
  imagePreview: {
    width: "116px",
    aspectRatio: "4 / 3",
    borderRadius: "7px",
    background: "#eef2f6",
    objectFit: "contain",
  },
  imageEmpty: {
    display: "grid",
    placeItems: "center",
    width: "116px",
    aspectRatio: "4 / 3",
    borderRadius: "7px",
    background: "#eef2f6",
    color: "#667085",
    fontSize: "12px",
    textAlign: "center",
  },
  imagePickerText: {
    display: "grid",
    gap: "6px",
    alignContent: "center",
    minWidth: 0,
  },
  secondaryButton: {
    justifySelf: "start",
    border: "1px solid #c9d2df",
    borderRadius: "8px",
    background: "#fff",
    color: "#344054",
    cursor: "pointer",
    fontWeight: 800,
    padding: "9px 11px",
  },
  details: {
    display: "grid",
    gap: "8px",
    color: "#667085",
    fontSize: "13px",
  },
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
    gap: "8px",
    maxHeight: "360px",
    overflow: "auto",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    padding: "8px",
  },
  mediaChoice: {
    display: "grid",
    gap: "6px",
    minWidth: 0,
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#fff",
    padding: "6px",
    textAlign: "left",
    font: "inherit",
    cursor: "pointer",
  },
  mediaChoiceImage: {
    width: "100%",
    aspectRatio: "4 / 3",
    borderRadius: "6px",
    background: "#eef2f6",
    objectFit: "contain",
  },
  linkedPanel: {
    display: "grid",
    gap: "8px",
    border: "1px solid #d7dde5",
    borderRadius: "8px",
    background: "#f8fafc",
    padding: "12px",
  },
  regionList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#344054",
    fontSize: "13px",
  },
  primaryButton: {
    border: 0,
    borderRadius: "8px",
    background: "#175cd3",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
    padding: "10px 12px",
  },
} satisfies Record<string, CSSProperties>;
