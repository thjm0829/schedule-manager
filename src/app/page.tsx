"use client";

import { useEffect, useState } from "react";
import ScheduleForm from "@/components/ScheduleForm";
import ScheduleList from "@/components/ScheduleList";
import type { Schedule, ScheduleInput } from "@/types/schedule";

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  async function loadSchedules() {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch("/api/schedules");
      if (!res.ok) throw new Error("일정을 불러오지 못했습니다.");
      const data: Schedule[] = await res.json();
      setSchedules(data);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  async function handleSubmit(input: ScheduleInput) {
    const url = editingSchedule ? `/api/schedules/${editingSchedule.id}` : "/api/schedules";
    const method = editingSchedule ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "저장에 실패했습니다.");
    }

    setEditingSchedule(null);
    await loadSchedules();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 일정을 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제에 실패했습니다.");
      return;
    }
    if (editingSchedule?.id === id) setEditingSchedule(null);
    await loadSchedules();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">일정 관리</h1>

      <div className="mb-8">
        <ScheduleForm
          editingSchedule={editingSchedule}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingSchedule(null)}
        />
      </div>

      <h2 className="mb-3 text-lg font-semibold">전체 일정</h2>
      {loading && <p className="text-sm text-slate-500">불러오는 중...</p>}
      {listError && <p className="text-sm text-red-600">{listError}</p>}
      {!loading && !listError && (
        <ScheduleList schedules={schedules} onEdit={setEditingSchedule} onDelete={handleDelete} />
      )}
    </main>
  );
}
