import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ChartType } from "@prisma/client";

const visualizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(ChartType),
  config: z.record(z.any()),
  dataConfig: z.record(z.any()),
  position: z.number(),
  size: z.string().optional(),
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
    const body = visualizationSchema.parse(json);

    const visualization = await prisma.visualization.create({
      data: {
        ...body,
        dashboardId: id,
      },
    });

    return NextResponse.json(visualization);
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
    const visualizationId = url.searchParams.get("visualizationId");

    if (!visualizationId) {
      return new NextResponse("Visualization ID is required", { status: 400 });
    }

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

    // Check if visualization exists and belongs to this dashboard
    const visualization = await prisma.visualization.findUnique({
      where: {
        id: visualizationId,
        dashboardId: id,
      },
    });

    if (!visualization) {
      return new NextResponse("Visualization not found", { status: 404 });
    }

    await prisma.visualization.delete({
      where: {
        id: visualizationId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting visualization:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
