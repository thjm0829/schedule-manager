"use client";

import type { Schedule } from "@/types/schedule";
import { STATUS_COLORS, TYPE_COLORS } from "@/lib/scheduleMeta";

function formatRange(startDate: string, endDate: string, allDay: boolean) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateFmt: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Seoul" };
  const timeFmt: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" };

  if (allDay) {
    return start.toLocaleDateString("ko-KR", dateFmt);
  }

  const sameDay = start.toLocaleDateString("ko-KR") === end.toLocaleDateString("ko-KR");
  if (sameDay) {
    return `${start.toLocaleDateString("ko-KR", dateFmt)} ${start.toLocaleTimeString(
      "ko-KR",
      timeFmt
    )} - ${end.toLocaleTimeString("ko-KR", timeFmt)}`;
  }
  return `${start.toLocaleDateString("ko-KR", dateFmt)} ${start.toLocaleTimeString(
    "ko-KR",
    timeFmt
  )} ~ ${end.toLocaleDateString("ko-KR", dateFmt)} ${end.toLocaleTimeString("ko-KR", timeFmt)}`;
}

type Props = {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
};

export default function ScheduleItem({ schedule, onEdit, onDelete }: Props) {
  const typeColor = TYPE_COLORS[schedule.type];
  const statusColor = STATUS_COLORS[schedule.status];

  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
      <div>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${typeColor.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${typeColor.dot}`} />
            {schedule.type}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColor.badge}`}>{schedule.status}</span>
        </div>
        <p className={`font-medium text-slate-100 ${statusColor.strikethrough ? "line-through opacity-70" : ""}`}>
          {schedule.title}
        </p>
        <p className="text-sm text-slate-400">
          {formatRange(schedule.startDate, schedule.endDate, schedule.allDay)}
        </p>
        {schedule.location && <p className="text-sm text-slate-400">📍 {schedule.location}</p>}
        {schedule.memo && <p className="mt-1 text-sm text-slate-300">{schedule.memo}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(schedule)}
          className="rounded-md border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:bg-slate-700"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(schedule.id)}
          className="rounded-md border border-red-900 px-3 py-1 text-sm text-red-400 hover:bg-red-950"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
