"use client";

import { type CSSProperties, useMemo, useState } from "react";
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

const emptyPost: EditorPost = {
  id: "manual-placeholder",
  title: "Untitled placeholder post",
  slug: "untitled-placeholder-post",
  status: "draft",
  excerpt: "",
  imagePath: "",
  source: "manual",
  sourcePagePath: "/",
  linkedRegionIds: [],
};

export function EditorPostsWorkspace() {
  const [posts, setPosts] = useState<EditorPost[]>(() => editorPostPlaceholders.map((post) => ({ ...post })));
  const [selectedPostId, setSelectedPostId] = useState(posts[0]?.id ?? "");
  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0] ?? emptyPost,
    [posts, selectedPostId],
  );

  function selectPost(postId: string) {
    setSelectedPostId(postId);
  }

  function updateSelectedPost(update: Partial<EditorPost>) {
    setPosts((current) =>
      current.map((post) => (post.id === selectedPost.id ? { ...post, ...update } : post)),
    );
  }

  function createPlaceholder() {
    const id = `manual-placeholder-${posts.length + 1}`;
    const post: EditorPost = {
      ...emptyPost,
      id,
      slug: id,
      linkedRegionIds: [],
    };
    setPosts((current) => [post, ...current]);
    setSelectedPostId(id);
  }

  function savePost() {
    updateSelectedPost({ title: selectedPost.title.trim() || "Untitled placeholder post" });
  }

  return (
    <section data-editor-posts-workspace style={styles.layout}>
      <div style={styles.listPanel}>
        <div style={styles.headerRow}>
          <div>
            <h3 style={styles.heading}>Posts</h3>
            <span style={styles.muted}>{posts.length} placeholder records</span>
          </div>
          <button type="button" onClick={createPlaceholder} style={styles.primaryButton}>
            Create placeholder
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
              <span style={styles.status}>{post.source === "site-scan" ? "Scanned placeholder" : "Manual placeholder"}</span>
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
          <p style={styles.muted}>Source: {selectedPost.sourcePagePath}</p>
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
        <label style={styles.label}>
          Image path
          <input
            value={selectedPost.imagePath}
            onChange={(event) => updateSelectedPost({ imagePath: event.target.value })}
            style={styles.input}
          />
        </label>
        <div style={styles.linkedPanel}>
          <strong>Linked regions</strong>
          {selectedPost.linkedRegionIds.length > 0 ? (
            <ul style={styles.regionList}>
              {selectedPost.linkedRegionIds.map((regionId) => (
                <li key={regionId}>{regionId}</li>
              ))}
            </ul>
          ) : (
            <p style={styles.muted}>Use preview multi-select later to attach text, image, and link regions.</p>
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
  },
  postButtonActive: {
    borderColor: "#175cd3",
    boxShadow: "0 0 0 3px rgba(23, 92, 211, 0.12)",
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
