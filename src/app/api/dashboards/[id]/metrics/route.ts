import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const metricSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  value: z.number(),
  target: z.number().optional(),
  unit: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Verify dashboard exists and belongs to user
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!dashboard) {
      return new NextResponse("Dashboard not found", { status: 404 });
    }

    const json = await req.json();
    const body = metricSchema.parse(json);

    const metric = await prisma.metric.create({
      data: {
        ...body,
        dashboardId: id,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const url = new URL(req.url);
    const metricId = url.searchParams.get("metricId");

    if (!metricId) {
      return new NextResponse("Metric ID is required", { status: 400 });
    }

    // Verify dashboard exists and belongs to user
    const dashboard = await prisma.dashboard.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        metrics: {
          where: {
            id: metricId,
          },
        },
      },
    });

    if (!dashboard) {
      return new NextResponse("Dashboard not found", { status: 404 });
    }

    if (dashboard.metrics.length === 0) {
      return new NextResponse("Metric not found", { status: 404 });
    }

    await prisma.metric.delete({
      where: {
        id: metricId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
