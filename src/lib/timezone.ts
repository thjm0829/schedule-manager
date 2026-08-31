// 이 앱의 모든 날짜/시간 입력과 "오늘" 판정은 서버·브라우저의 로컬 타임존과
// 무관하게 Asia/Seoul(KST, UTC+9, DST 없음) 기준으로 고정한다.
const SEOUL_OFFSET_MINUTES = 9 * 60;
const TIME_ZONE = "Asia/Seoul";

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function getSeoulParts(date: Date) {
  const parts = partsFormatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/** "YYYY-MM-DD" — 이 시각이 서울 기준으로 속한 날짜 키. */
export function seoulDateKey(date: Date): string {
  const { year, month, day } = getSeoulParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function isSameSeoulDay(a: Date, b: Date): boolean {
  return seoulDateKey(a) === seoulDateKey(b);
}

/** day가 서울 기준으로 [rangeStart, rangeEnd] 날짜 범위(포함) 안에 속하는지. */
export function isSeoulDayWithinRange(day: Date, rangeStart: Date, rangeEnd: Date): boolean {
  const key = seoulDateKey(day);
  return key >= seoulDateKey(rangeStart) && key <= seoulDateKey(rangeEnd);
}

const MAX_SPAN_DAYS = 366;

/** start~end(포함) 사이의 모든 날짜를 서울 기준 "YYYY-MM-DD" 키 배열로 반환. */
export function seoulDateKeysBetween(start: Date, end: Date): string[] {
  const startParts = getSeoulParts(start);
  const endParts = getSeoulParts(end);
  const cursorStart = Date.UTC(startParts.year, startParts.month - 1, startParts.day);
  const cursorEnd = Date.UTC(endParts.year, endParts.month - 1, endParts.day);

  const pad = (n: number) => String(n).padStart(2, "0");
  const keys: string[] = [];
  let cursor = cursorStart;
  while (cursor <= cursorEnd && keys.length < MAX_SPAN_DAYS) {
    const d = new Date(cursor);
    keys.push(`${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`);
    cursor += 24 * 60 * 60 * 1000;
  }
  return keys;
}

/** datetime-local input 값("YYYY-MM-DDTHH:mm")을 서울 로컬 시각으로 해석해 UTC ISO 문자열로 변환. */
export function seoulLocalInputToIso(localValue: string): string {
  const [datePart, timePart] = localValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = (timePart ?? "00:00").split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - SEOUL_OFFSET_MINUTES * 60 * 1000;
  return new Date(utcMs).toISOString();
}

/** ISO 문자열을 서울 로컬 기준 datetime-local input 값으로 변환. */
export function isoToSeoulLocalInputValue(iso: string): string {
  const { year, month, day, hour, minute } = getSeoulParts(new Date(iso));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}
