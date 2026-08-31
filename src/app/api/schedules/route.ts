import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateScheduleInput } from "@/lib/validateSchedule";

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { startAt: "asc" },
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
      description: result.data.description ?? null,
      location: result.data.location ?? null,
      startAt: new Date(result.data.startAt),
      endAt: new Date(result.data.endAt),
      allDay: result.data.allDay ?? false,
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
