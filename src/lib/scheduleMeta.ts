export const SCHEDULE_TYPES = ["약속", "업무", "개인", "건강", "중요"] as const;
export type ScheduleType = (typeof SCHEDULE_TYPES)[number];

export const SCHEDULE_STATUSES = ["예정", "진행", "완료"] as const;
export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

export const DEFAULT_SCHEDULE_TYPE: ScheduleType = "개인";
export const DEFAULT_SCHEDULE_STATUS: ScheduleStatus = "예정";

// 유형별 색상 규칙: 약속-파랑 / 업무-초록 / 개인-보라 / 건강-주황 / 중요-빨강
export const TYPE_COLORS: Record<ScheduleType, { dot: string; badge: string }> = {
  약속: { dot: "bg-blue-500", badge: "bg-blue-500/15 text-blue-300 border-blue-700/60" },
  업무: { dot: "bg-green-500", badge: "bg-green-500/15 text-green-300 border-green-700/60" },
  개인: { dot: "bg-purple-500", badge: "bg-purple-500/15 text-purple-300 border-purple-700/60" },
  건강: { dot: "bg-orange-500", badge: "bg-orange-500/15 text-orange-300 border-orange-700/60" },
  중요: { dot: "bg-red-500", badge: "bg-red-500/15 text-red-300 border-red-700/60" },
};

// 상태별 표시 규칙: 예정-회색 / 진행-노랑 / 완료-초록(+취소선)
export const STATUS_COLORS: Record<ScheduleStatus, { badge: string; strikethrough?: boolean }> = {
  예정: { badge: "bg-slate-500/15 text-slate-300 border-slate-600/60" },
  진행: { badge: "bg-yellow-500/15 text-yellow-300 border-yellow-700/60" },
  완료: { badge: "bg-green-500/15 text-green-300 border-green-700/60", strikethrough: true },
};

export function isScheduleType(value: unknown): value is ScheduleType {
  return typeof value === "string" && (SCHEDULE_TYPES as readonly string[]).includes(value);
}

export function isScheduleStatus(value: unknown): value is ScheduleStatus {
  return typeof value === "string" && (SCHEDULE_STATUSES as readonly string[]).includes(value);
}
