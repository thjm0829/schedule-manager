import type { ScheduleInput } from "@/types/schedule";

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
  if (typeof b.startAt !== "string" || isNaN(Date.parse(b.startAt))) {
    return { ok: false, error: "시작 시각(startAt)이 올바르지 않습니다." };
  }
  if (typeof b.endAt !== "string" || isNaN(Date.parse(b.endAt))) {
    return { ok: false, error: "종료 시각(endAt)이 올바르지 않습니다." };
  }
  if (new Date(b.endAt) < new Date(b.startAt)) {
    return { ok: false, error: "종료 시각은 시작 시각보다 빠를 수 없습니다." };
  }
  if (b.description !== undefined && typeof b.description !== "string") {
    return { ok: false, error: "설명(description)은 문자열이어야 합니다." };
  }
  if (b.location !== undefined && typeof b.location !== "string") {
    return { ok: false, error: "장소(location)는 문자열이어야 합니다." };
  }
  if (b.allDay !== undefined && typeof b.allDay !== "boolean") {
    return { ok: false, error: "종일 여부(allDay)는 boolean이어야 합니다." };
  }

  return {
    ok: true,
    data: {
      title: b.title.trim(),
      description: b.description as string | undefined,
      location: b.location as string | undefined,
      startAt: b.startAt,
      endAt: b.endAt,
      allDay: b.allDay as boolean | undefined,
    },
  };
}
