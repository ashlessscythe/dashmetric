import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChartType } from "@prisma/client";

interface VisualizationRequest {
  name: string;
  type: ChartType;
  config: any;
  position?: number;
  size?: string;
}

interface FieldMapping {
  field: string;
  displayName: string;
  selected: boolean;
  chartType: ChartType;
  axis: "x" | "y" | null;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { name, description, datasetId, visualizations, fieldMappings } =
      body;

    if (
      !name ||
      !datasetId ||
      !visualizations ||
      !Array.isArray(visualizations)
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Check if dataset exists and user has access
    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { file: true },
    });

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // Check if user has access to the dataset
    const isOwner = dataset.file.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to access this dataset" },
        { status: 403 }
      );
    }

    // Create the dashboard
    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        description,
        userId: user.id,
        datasetId,
      },
    });

    // Create visualizations
    const visualizationPromises = visualizations.map(
      (viz: VisualizationRequest, index: number) => {
        return prisma.visualization.create({
          data: {
            name: viz.name,
            type: viz.type,
            config: viz.config,
            dataConfig: {
              fieldMappings: fieldMappings || [],
            },
            position: viz.position || index,
            size: viz.size || "md",
            dashboardId: dashboard.id,
          },
        });
      }
    );

    await Promise.all(visualizationPromises);

    return NextResponse.json({
      id: dashboard.id,
      message: "Dashboard created successfully",
    });
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return NextResponse.json(
      { error: "Failed to create dashboard" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const shared = url.searchParams.get("shared") === "true";

    // Get dashboards
    let dashboards;

    if (shared) {
      // Get dashboards shared with the user
      dashboards = await prisma.dashboard.findMany({
        where: {
          OR: [
            { userId: user.id }, // User's own dashboards
            { shares: { some: { userId: user.id } } }, // Dashboards shared with the user
            { isPublic: true }, // Public dashboards
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          visualizations: {
            orderBy: {
              position: "asc",
            },
          },
          dataset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } else {
      // Get only user's dashboards
      dashboards = await prisma.dashboard.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          visualizations: {
            orderBy: {
              position: "asc",
            },
          },
          dataset: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }

    return NextResponse.json(dashboards);
  } catch (error) {
    console.error("Error fetching dashboards:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboards" },
      { status: 500 }
    );
  }
}
