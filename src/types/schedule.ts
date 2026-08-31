import type { ScheduleStatus, ScheduleType } from "@/lib/scheduleMeta";

export type Schedule = {
  id: string;
  title: string;
  memo: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  status: ScheduleStatus;
  type: ScheduleType;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleInput = {
  title: string;
  memo?: string;
  location?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  status?: ScheduleStatus;
  type: ScheduleType;
};
