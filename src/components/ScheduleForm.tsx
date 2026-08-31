"use client";

import { useEffect, useState } from "react";
import type { Schedule, ScheduleInput } from "@/types/schedule";

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

const emptyForm = {
  title: "",
  description: "",
  location: "",
  startAt: "",
  endAt: "",
  allDay: false,
};

type Props = {
  editingSchedule: Schedule | null;
  onSubmit: (input: ScheduleInput) => Promise<void>;
  onCancelEdit: () => void;
};

export default function ScheduleForm({ editingSchedule, onSubmit, onCancelEdit }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSchedule) {
      setForm({
        title: editingSchedule.title,
        description: editingSchedule.description ?? "",
        location: editingSchedule.location ?? "",
        startAt: toLocalInputValue(editingSchedule.startAt),
        endAt: toLocalInputValue(editingSchedule.endAt),
        allDay: editingSchedule.allDay,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingSchedule]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.startAt || !form.endAt) {
      setError("제목, 시작 시각, 종료 시각은 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description || undefined,
        location: form.location || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        allDay: form.allDay,
      });
      if (!editingSchedule) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{editingSchedule ? "일정 수정" : "일정 추가"}</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700">제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="예: 팀 회의"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">시작 시각 *</label>
          <input
            type="datetime-local"
            value={form.startAt}
            onChange={(e) => setForm({ ...form, startAt: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">종료 시각 *</label>
          <input
            type="datetime-local"
            value={form.endAt}
            onChange={(e) => setForm({ ...form, endAt: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">장소</label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">설명</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          rows={2}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
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
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {editingSchedule ? "수정 저장" : "추가"}
        </button>
        {editingSchedule && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
