"use client";

import { useState } from "react";
import MonthCalendar from "@/components/MonthCalendar";
import ScheduleList from "@/components/ScheduleList";
import type { Schedule } from "@/types/schedule";
import { isSeoulDayWithinRange } from "@/lib/timezone";
import schedulesData from "@/data/schedules.json";

const schedules = schedulesData as Schedule[];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function HomePage() {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const selectedDaySchedules = schedules.filter((s) =>
    isSeoulDayWithinRange(selectedDate, new Date(s.startDate), new Date(s.endDate))
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">일정 관리</h1>

      <div className="mb-8">
        <MonthCalendar
          viewMonth={viewMonth}
          selectedDate={selectedDate}
          schedules={schedules}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setViewMonth(startOfMonth(date));
          }}
          onPrevMonth={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          onNextMonth={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          onToday={() => {
            const now = new Date();
            setViewMonth(startOfMonth(now));
            setSelectedDate(now);
          }}
        />
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-100">
        {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
      </h2>
      <ScheduleList schedules={selectedDaySchedules} />
    </main>
  );
}
