type Props = {
  page: number;
  total: number;
  limit: number;
  onChange: (next: number) => void;
};

export default function Pagination({ page, total, limit, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const go = (p: number) => onChange(Math.min(Math.max(1, p), totalPages));
  const windowPages = [...Array(totalPages)]
    .map((_, i) => i + 1)
    .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages);

  return (
    <nav style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
      <button onClick={() => go(page - 1)} disabled={page <= 1}>이전</button>
      {windowPages.map((p, i) => {
        const prev = windowPages[i - 1];
        const needEllipsis = prev && p - prev > 1;
        return (
          <span key={p} style={{ display: "inline-flex", gap: 8 }}>
            {needEllipsis && <span>…</span>}
            <button
              onClick={() => go(p)}
              style={{
                fontWeight: p === page ? 700 : 400,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 10px",
                background: p === page ? "#111827" : "white",
                color: p === page ? "white" : "inherit",
              }}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button onClick={() => go(page + 1)} disabled={page >= totalPages}>다음</button>
    </nav>
  );
}
