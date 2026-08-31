"use client";

import type { Schedule } from "@/types/schedule";
import { TYPE_COLORS } from "@/lib/scheduleMeta";
import { seoulDateKey } from "@/lib/timezone";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function buildMonthGrid(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
}

type Props = {
  viewMonth: Date;
  selectedDate: Date;
  schedules: Schedule[];
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

export default function MonthCalendar({
  viewMonth,
  selectedDate,
  schedules,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: Props) {
  const days = buildMonthGrid(viewMonth);
  const today = new Date();
  const todayKey = seoulDateKey(today);
  const selectedKey = seoulDateKey(selectedDate);
  const currentMonth = viewMonth.getMonth();

  const schedulesByDay = new Map<string, Schedule[]>();
  for (const s of schedules) {
    const key = seoulDateKey(new Date(s.startDate));
    const bucket = schedulesByDay.get(key);
    if (bucket) bucket.push(s);
    else schedulesByDay.set(key, [s]);
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          aria-label="이전 달"
          className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-700"
        >
          ◀
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-100">
            {viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월
          </h2>
          <button
            onClick={onToday}
            className="rounded-md border border-slate-600 px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
          >
            오늘
          </button>
        </div>
        <button
          onClick={onNextMonth}
          aria-label="다음 달"
          className="rounded-md px-2 py-1 text-slate-300 hover:bg-slate-700"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-2">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = seoulDateKey(day);
          const daySchedules = schedulesByDay.get(key) ?? [];
          const inMonth = day.getMonth() === currentMonth;
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;

          return (
            <button
              key={dayKey(day)}
              onClick={() => onSelectDate(day)}
              className={[
                "min-h-[72px] rounded-md border p-1 text-left text-xs transition",
                isSelected ? "border-slate-100 bg-slate-700" : "border-slate-700/60 hover:bg-slate-700/50",
                inMonth ? "" : "opacity-40",
              ].join(" ")}
            >
              <div
                className={[
                  "mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full",
                  isToday ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-200",
                ].join(" ")}
              >
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {daySchedules.slice(0, 2).map((s) => {
                  const color = TYPE_COLORS[s.type];
                  return (
                    <div key={s.id} className={`truncate rounded border px-1 py-0.5 text-[10px] ${color.badge}`}>
                      {s.title}
                    </div>
                  );
                })}
                {daySchedules.length > 2 && (
                  <div className="text-[10px] text-slate-400">+{daySchedules.length - 2}개 더</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
