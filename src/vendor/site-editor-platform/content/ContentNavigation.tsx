import React from "react";
import { FileText, History, Images, Newspaper } from "lucide-react";
import type { ContentWorkspace } from "./content-types";

const items = [
  { id: "pages", label: "Pages", icon: FileText },
  { id: "posts", label: "Posts", icon: Newspaper },
  { id: "media", label: "Media", icon: Images },
  { id: "history", label: "History", icon: History },
] as const;

export function ContentNavigation({
  active,
  onChange,
}: {
  active: ContentWorkspace;
  onChange: (workspace: ContentWorkspace) => void;
}) {
  return (
    <nav aria-label="Editor content" style={{ display: "grid", gap: 6, marginBottom: 18 }}>
      {items.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          onClick={() => onChange(id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            width: "100%",
            border: "1px solid",
            borderColor: active === id ? "#b2ccff" : "transparent",
            borderRadius: 8,
            background: active === id ? "#eef4ff" : "transparent",
            color: active === id ? "#175cd3" : "#344054",
            padding: "10px 12px",
            font: "inherit",
            fontWeight: 700,
            textAlign: "left",
          }}
        >
          <Icon size={17} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
