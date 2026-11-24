import type { ReactNode } from "react";

export type SymbolKind = "transport" | "fill" | "modular" | "visibility" | "konstruksi" | "jalan" | "publik" | "distributor";

export function ProductSymbol({ kind }: { kind: SymbolKind }) {
  const paths: Record<SymbolKind, ReactNode> = {
    transport: <><path d="M5 9h19v16H5zM24 15h7l6 7v3H24M28 15v7h9M4 25h3m10 0h9" /><circle cx="12" cy="27" r="4" /><circle cx="31" cy="27" r="4" /><path d="M10 5h12M7 13H2M7 18H1" /></>,
    fill: <><path d="M20 3C16 10 9 17 9 24a11 11 0 0 0 22 0c0-7-7-14-11-21Z" /><path d="M14 25a6 6 0 0 0 6 6M5 35h30" /></>,
    modular: <><path d="M3 11h13v6h8v-6h13v20H24v-6h-8v6H3zM9 7v4m22-4v4M9 31v4m22-4v4" /></>,
    visibility: <><path d="M3 21s6-10 17-10 17 10 17 10-6 10-17 10S3 21 3 21Z" /><circle cx="20" cy="21" r="5" /><path d="M20 3v4M7 6l3 3m23-3-3 3M3 35l4-4m30 4-4-4" /></>,
    konstruksi: <><path d="M7 23v-3a13 13 0 0 1 26 0v3M4 23h32v6H4zM16 8v11m8-11v11M11 33h18" /></>,
    jalan: <><path d="m12 4-7 32m23-32 7 32M20 5v6m0 6v6m0 6v6M10 16h20" /></>,
    publik: <><path d="M4 35h32M7 35V14h12v21m0-27h14v27M23 5h6M11 19h4m-4 6h4m9-12h4m-4 6h4m-4 6h4" /></>,
    distributor: <><path d="m5 11 9-5 9 5-9 5-9-5Zm0 0v11l9 5 9-5V11M14 16v11M23 18l6-3 8 5-8 5-6-4m0 11 6 4 8-5V20m-8 5v11" /></>,
  };
  return <svg viewBox="0 0 40 40" aria-hidden="true" className="product-symbol">{paths[kind]}</svg>;
}

export function BestSellerBadge() {
  return <span className="bestseller-badge"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2 2.4 4.8 5.3.8-3.8 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L2.3 7.6l5.3-.8L10 2Z" /></svg> BEST SELLER</span>;
}
