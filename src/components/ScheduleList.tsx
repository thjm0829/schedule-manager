"use client";

import type { Schedule } from "@/types/schedule";
import ScheduleItem from "./ScheduleItem";

type Props = {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
};

export default function ScheduleList({ schedules, onEdit, onDelete }: Props) {
  if (schedules.length === 0) {
    return <p className="text-sm text-slate-400">등록된 일정이 없습니다.</p>;
  }

  return (
    <ul className="space-y-2">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
