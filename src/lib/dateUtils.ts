function parseDate(dateString: unknown): Date {
  if (!dateString && dateString !== 0) return new Date(NaN);

  // Java LocalDateTime 배열 포맷 [year, month, day, hour, min, sec, nano]
  if (Array.isArray(dateString)) {
    const [y, mo, d, h = 0, m = 0, s = 0] = dateString as number[];
    return new Date(Date.UTC(y, mo - 1, d, h, m, s));
  }

  const str = String(dateString)
    .replace(" ", "T")
    .replace(/(\.\d{3})\d+/, "$1"); // 마이크로초·나노초 → 밀리초(3자리)로 절삭

  return new Date(
    str.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(str) ? str : str + "Z"
  );
}

export function formatDateTime(dateString: unknown): string {
  if (!dateString && dateString !== 0) return "-";
  try {
    const d = parseDate(dateString);
    if (isNaN(d.getTime())) return "-";
    const kst = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    const yyyy = kst.getFullYear();
    const mm = String(kst.getMonth() + 1).padStart(2, "0");
    const dd = String(kst.getDate()).padStart(2, "0");
    const hh = String(kst.getHours()).padStart(2, "0");
    const min = String(kst.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  } catch {
    return "-";
  }
}

export function formatRelativeTime(dateString: unknown): string {
  if (!dateString && dateString !== 0) return "-";
  try {
    const d = parseDate(dateString);
    if (isNaN(d.getTime())) return "-";
    const diff = Date.now() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (seconds < 60) return "방금";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (hours < 72) return `${days}일 전`;
    return formatDateTime(dateString);
  } catch {
    return "-";
  }
}
