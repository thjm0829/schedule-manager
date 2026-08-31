import type { ScheduleInput } from "@/types/schedule";
import { DEFAULT_SCHEDULE_STATUS, isScheduleStatus, isScheduleType } from "@/lib/scheduleMeta";

export function validateScheduleInput(
  body: unknown
): { ok: true; data: ScheduleInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "요청 본문이 올바르지 않습니다." };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || b.title.trim().length === 0) {
    return { ok: false, error: "제목(title)은 필수입니다." };
  }
  if (typeof b.startDate !== "string" || isNaN(Date.parse(b.startDate))) {
    return { ok: false, error: "시작일(startDate)이 올바르지 않습니다." };
  }
  if (typeof b.endDate !== "string" || isNaN(Date.parse(b.endDate))) {
    return { ok: false, error: "종료일(endDate)이 올바르지 않습니다." };
  }
  if (new Date(b.endDate) < new Date(b.startDate)) {
    return { ok: false, error: "종료일은 시작일보다 빠를 수 없습니다." };
  }
  if (b.memo !== undefined && typeof b.memo !== "string") {
    return { ok: false, error: "메모(memo)는 문자열이어야 합니다." };
  }
  if (b.location !== undefined && typeof b.location !== "string") {
    return { ok: false, error: "장소(location)는 문자열이어야 합니다." };
  }
  if (b.allDay !== undefined && typeof b.allDay !== "boolean") {
    return { ok: false, error: "종일 여부(allDay)는 boolean이어야 합니다." };
  }
  if (!isScheduleType(b.type)) {
    return { ok: false, error: "유형(type)은 약속/업무/개인/건강/중요 중 하나여야 합니다." };
  }
  if (b.status !== undefined && !isScheduleStatus(b.status)) {
    return { ok: false, error: "상태(status)는 예정/진행/완료 중 하나여야 합니다." };
  }

  return {
    ok: true,
    data: {
      title: b.title.trim(),
      memo: b.memo as string | undefined,
      location: b.location as string | undefined,
      startDate: b.startDate,
      endDate: b.endDate,
      allDay: b.allDay as boolean | undefined,
      type: b.type,
      status: (b.status as ScheduleInput["status"]) ?? DEFAULT_SCHEDULE_STATUS,
    },
  };
}
