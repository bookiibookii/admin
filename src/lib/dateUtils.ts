function parseDate(dateString: string): Date {
  if (!dateString) return new Date(NaN);
  // 마이크로초(6자리) → 밀리초(3자리) 절삭, 공백 구분자 → T 변환
  const s = dateString.replace(" ", "T").replace(/(\.\d{3})\d+/, "$1");
  return new Date(s.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(s) ? s : s + "Z");
}

export function formatDateTime(dateString: string): string {
  const d = parseDate(dateString);
  const kst = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const yyyy = kst.getFullYear();
  const mm = String(kst.getMonth() + 1).padStart(2, "0");
  const dd = String(kst.getDate()).padStart(2, "0");
  const hh = String(kst.getHours()).padStart(2, "0");
  const min = String(kst.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const diff = now - parseDate(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (hours < 72) return `${days}일 전`;
  return formatDateTime(dateString);
}
