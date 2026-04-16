// Minimal CSV helpers — serialize/parse without a third-party dep.
// Follows RFC-4180-ish rules: quoted fields, double-quote escaping, CRLF line breaks.

function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCSV(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return columns ? columns.map((c) => c.label || c.key).join(",") + "\r\n" : "";
  }
  const cols = columns || Object.keys(rows[0]).map((k) => ({ key: k, label: k }));
  const header = cols.map((c) => escapeCell(c.label || c.key)).join(",");
  const body = rows
    .map((row) =>
      cols
        .map((c) => {
          const raw = typeof c.get === "function" ? c.get(row) : row[c.key];
          return escapeCell(raw);
        })
        .join(","),
    )
    .join("\r\n");
  return header + "\r\n" + body + "\r\n";
}

export function downloadCSV(filename, rows, columns) {
  const csv = toCSV(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Minimal parser: splits on newlines, respects quoted fields and escaped quotes.
export function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += ch;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  // Remove empty trailing row
  if (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) rows.pop();
  return rows;
}

// Turn a 2D CSV array into [{colName: value}] using the first row as headers.
export function csvToObjects(text) {
  const rows = parseCSV(text);
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? "";
    });
    return obj;
  });
}
