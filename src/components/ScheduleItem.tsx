"use client";

import type { Schedule } from "@/types/schedule";

function formatRange(startAt: string, endAt: string, allDay: boolean) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const dateFmt: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", weekday: "short" };
  const timeFmt: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

  if (allDay) {
    return start.toLocaleDateString("ko-KR", dateFmt);
  }

  const sameDay = start.toDateString() === end.toDateString();
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
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="font-medium text-slate-900">{schedule.title}</p>
        <p className="text-sm text-slate-500">
          {formatRange(schedule.startAt, schedule.endAt, schedule.allDay)}
        </p>
        {schedule.location && <p className="text-sm text-slate-500">📍 {schedule.location}</p>}
        {schedule.description && <p className="mt-1 text-sm text-slate-600">{schedule.description}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(schedule)}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(schedule.id)}
          className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
