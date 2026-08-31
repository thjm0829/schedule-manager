import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateScheduleInput } from "@/lib/validateSchedule";

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(schedules);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const result = validateScheduleInput(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      title: result.data.title,
      memo: result.data.memo ?? null,
      location: result.data.location ?? null,
      startDate: new Date(result.data.startDate),
      endDate: new Date(result.data.endDate),
      allDay: result.data.allDay ?? false,
      type: result.data.type,
      status: result.data.status,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
