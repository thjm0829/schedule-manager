"use client";

import { useEffect, useState } from "react";
import type { Schedule, ScheduleInput } from "@/types/schedule";
import {
  DEFAULT_SCHEDULE_STATUS,
  DEFAULT_SCHEDULE_TYPE,
  SCHEDULE_STATUSES,
  SCHEDULE_TYPES,
  type ScheduleStatus,
  type ScheduleType,
} from "@/lib/scheduleMeta";
import { isoToSeoulLocalInputValue, seoulLocalInputToIso } from "@/lib/timezone";

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function defaultFormFor(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0);
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0);
  return {
    title: "",
    memo: "",
    location: "",
    startDate: toLocalInputValue(start),
    endDate: toLocalInputValue(end),
    allDay: false,
    status: DEFAULT_SCHEDULE_STATUS as ScheduleStatus,
    type: DEFAULT_SCHEDULE_TYPE as ScheduleType,
  };
}

type Props = {
  editingSchedule: Schedule | null;
  defaultDate: Date;
  onSubmit: (input: ScheduleInput) => Promise<void>;
  onCancelEdit: () => void;
};

export default function ScheduleForm({ editingSchedule, defaultDate, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState(() => defaultFormFor(defaultDate));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSchedule) {
      setForm({
        title: editingSchedule.title,
        memo: editingSchedule.memo ?? "",
        location: editingSchedule.location ?? "",
        startDate: isoToSeoulLocalInputValue(editingSchedule.startDate),
        endDate: isoToSeoulLocalInputValue(editingSchedule.endDate),
        allDay: editingSchedule.allDay,
        status: editingSchedule.status,
        type: editingSchedule.type,
      });
    } else {
      setForm(defaultFormFor(defaultDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSchedule, defaultDate.getTime()]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.startDate || !form.endDate) {
      setError("제목, 시작일, 종료일은 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title,
        memo: form.memo || undefined,
        location: form.location || undefined,
        startDate: seoulLocalInputToIso(form.startDate),
        endDate: seoulLocalInputToIso(form.endDate),
        allDay: form.allDay,
        status: form.status,
        type: form.type,
      });
      if (!editingSchedule) {
        setForm(defaultFormFor(defaultDate));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-100">{editingSchedule ? "일정 수정" : "일정 추가"}</h2>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-300">제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          placeholder="예: 팀 회의"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300">시작일 *</label>
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">종료일 *</label>
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300">유형 *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ScheduleType })}
            className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {SCHEDULE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">상태</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ScheduleStatus })}
            className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100"
          >
            {SCHEDULE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">장소</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300">메모</label>
        <textarea
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          rows={2}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={form.allDay}
          onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
        />
        종일
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          {editingSchedule ? "수정 저장" : "추가"}
        </button>
        {editingSchedule && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
