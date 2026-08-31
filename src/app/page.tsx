"use client";

import { useEffect, useState } from "react";
import MonthCalendar from "@/components/MonthCalendar";
import ScheduleForm from "@/components/ScheduleForm";
import ScheduleList from "@/components/ScheduleList";
import type { Schedule, ScheduleInput } from "@/types/schedule";
import { isSeoulDayWithinRange } from "@/lib/timezone";

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function HomePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());

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
    setShowForm(false);
    await loadSchedules();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 일정을 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제에 실패했습니다.");
      return;
    }
    if (editingSchedule?.id === id) {
      setEditingSchedule(null);
      setShowForm(false);
    }
    await loadSchedules();
  }

  function handleEdit(schedule: Schedule) {
    setEditingSchedule(schedule);
    setShowForm(true);
  }

  async function handleToggleComplete(schedule: Schedule) {
    const nextStatus = schedule.status === "완료" ? "예정" : "완료";
    const res = await fetch(`/api/schedules/${schedule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: schedule.title,
        memo: schedule.memo ?? undefined,
        location: schedule.location ?? undefined,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        allDay: schedule.allDay,
        type: schedule.type,
        status: nextStatus,
      }),
    });
    if (!res.ok) {
      alert("상태 변경에 실패했습니다.");
      return;
    }
    await loadSchedules();
  }

  const selectedDaySchedules = schedules.filter((s) =>
    isSeoulDayWithinRange(selectedDate, new Date(s.startDate), new Date(s.endDate))
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">일정 관리</h1>

      {loading && <p className="mb-4 text-sm text-slate-400">불러오는 중...</p>}
      {listError && <p className="mb-4 text-sm text-red-400">{listError}</p>}

      <div className="mb-8">
        <MonthCalendar
          viewMonth={viewMonth}
          selectedDate={selectedDate}
          schedules={schedules}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          onNextMonth={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          onToday={() => {
            const now = new Date();
            setViewMonth(startOfMonth(now));
            setSelectedDate(now);
          }}
        />
      </div>

      <div className="mb-8">
        {showForm ? (
          <ScheduleForm
            editingSchedule={editingSchedule}
            defaultDate={selectedDate}
            onSubmit={handleSubmit}
            onCancelEdit={() => {
              setEditingSchedule(null);
              setShowForm(false);
            }}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm font-medium text-slate-300 hover:border-slate-400 hover:bg-slate-800"
          >
            + 일정 추가
          </button>
        )}
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-100">
        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
      </h2>
      {!loading && !listError && (
        <ScheduleList
          schedules={selectedDaySchedules}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </main>
  );
}
