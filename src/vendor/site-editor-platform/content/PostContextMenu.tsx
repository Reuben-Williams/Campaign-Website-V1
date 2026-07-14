import React from "react";
import { ExternalLink, FileClock, Pencil, Replace, Trash2, X } from "lucide-react";

export function computeContextMenuPosition(
  anchor: { x: number; y: number },
  viewport: { width: number; height: number },
  menu: { width: number; height: number } = { width: 260, height: 280 },
) {
  const margin = 16;
  return {
    left: Math.max(margin, Math.min(anchor.x, viewport.width - menu.width - margin)),
    top: Math.max(margin, Math.min(anchor.y, viewport.height - menu.height - margin)),
  };
}

export function PostContextMenu({
  entryId, regionId, collectionMode, position, onEdit, onChooseAnother,
  onOpenDetail, onViewHistory, onRemove, onClose,
}: {
  entryId: string;
  regionId: string;
  collectionMode: "manual" | "query";
  position: { left: number; top: number };
  onEdit: () => void;
  onChooseAnother?: () => void;
  onOpenDetail: () => void;
  onViewHistory: () => void;
  onRemove?: () => void;
  onClose: () => void;
}) {
  return (
    <div role="menu" aria-label="Post actions" data-builder-entry-id={entryId} data-builder-region-id={regionId} style={{ ...styles.menu, left: position.left, top: position.top }}>
      <div style={styles.header}>
        <strong>Post options</strong>
        <button type="button" aria-label="Close post options" onClick={onClose} style={styles.close}><X size={17} /></button>
      </div>
      <MenuButton icon={<Pencil size={17} />} label="Edit post" onClick={onEdit} />
      {collectionMode === "manual" && onChooseAnother ? <MenuButton icon={<Replace size={17} />} label="Choose another post" onClick={onChooseAnother} /> : null}
      <MenuButton icon={<ExternalLink size={17} />} label="Open detail page" onClick={onOpenDetail} />
      <MenuButton icon={<FileClock size={17} />} label="View history" onClick={onViewHistory} />
      {collectionMode === "manual" && onRemove ? <MenuButton icon={<Trash2 size={17} />} label="Remove from collection" onClick={onRemove} danger /> : null}
    </div>
  );
}

function MenuButton({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" role="menuitem" onClick={onClick} style={{ ...styles.item, ...(danger ? styles.danger : {}) }}>{icon}<span>{label}</span></button>;
}

const styles = {
  menu: { position: "fixed", zIndex: 1000, display: "grid", width: 260, border: "1px solid #c9d2df", borderRadius: 8, background: "#fff", boxShadow: "0 18px 50px rgba(15,23,42,.24)", padding: 8 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 8px 10px" },
  close: { display: "grid", placeItems: "center", width: 32, height: 32, border: 0, background: "transparent", color: "#475467" },
  item: { display: "flex", alignItems: "center", gap: 9, width: "100%", border: 0, borderRadius: 6, background: "transparent", color: "#344054", padding: 10, font: "inherit", fontWeight: 600, textAlign: "left" },
  danger: { color: "#b42318" },
} satisfies Record<string, React.CSSProperties>;
