import prettyBytes from "pretty-bytes";

export function formatPercentage(num?: number) {
  if (!num) return "N/A";
  return num.toLocaleString("en", { style: "percent" });
}

export function formatBytes(num?: number) {
  return prettyBytes(num ?? 1);
}
