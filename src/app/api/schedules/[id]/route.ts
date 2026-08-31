import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateScheduleInput } from "@/lib/validateSchedule";

type Params = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: Params) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: params.id },
  });

  if (!schedule) {
    return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(schedule);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const existing = await prisma.schedule.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const result = validateScheduleInput(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const schedule = await prisma.schedule.update({
    where: { id: params.id },
    data: {
      title: result.data.title,
      description: result.data.description ?? null,
      location: result.data.location ?? null,
      startAt: new Date(result.data.startAt),
      endAt: new Date(result.data.endAt),
      allDay: result.data.allDay ?? false,
    },
  });

  return NextResponse.json(schedule);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const existing = await prisma.schedule.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "일정을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.schedule.delete({ where: { id: params.id } });
  return new NextResponse(null, { status: 204 });
}
