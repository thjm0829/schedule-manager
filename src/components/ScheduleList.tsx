import type { Schedule } from "@/types/schedule";
import ScheduleItem from "./ScheduleItem";

type Props = {
  schedules: Schedule[];
};

export default function ScheduleList({ schedules }: Props) {
  if (schedules.length === 0) {
    return <p className="text-sm text-slate-400">등록된 일정이 없습니다.</p>;
  }

  return (
    <ul className="space-y-2">
      {schedules.map((schedule) => (
        <ScheduleItem key={schedule.id} schedule={schedule} />
      ))}
    </ul>
  );
}
