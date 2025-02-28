import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardView } from "./dashboard-view";

interface DashboardPageProps {
  params: {
    id: string;
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return notFound();
  }

  // Fetch the dashboard
  const dashboard = await prisma.dashboard.findUnique({
    where: {
      id: params.id,
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
        include: {
          dataEntries: true,
        },
      },
      shares: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!dashboard) {
    return notFound();
  }

  // Fetch the current user
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!user) {
    return notFound();
  }

  // Check if the user has permission to access this dashboard
  const isOwner = dashboard.userId === user.id;
  const isSharedWith = dashboard.shares.some(
    (share) => share.userId === user.id
  );
  const isAdmin = user.role === "ADMIN";
  const isPublic = dashboard.isPublic;

  if (!isOwner && !isSharedWith && !isAdmin && !isPublic) {
    return notFound();
  }

  // Prepare the data for the client component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientDashboard: any = {
    id: dashboard.id,
    name: dashboard.name,
    description: dashboard.description,
    isPublic: dashboard.isPublic,
    createdAt: dashboard.createdAt.toISOString(),
    updatedAt: dashboard.updatedAt.toISOString(),
    userId: dashboard.userId,
    user: dashboard.user,
    visualizations: dashboard.visualizations.map((viz) => ({
      ...viz,
      createdAt: viz.createdAt.toISOString(),
      updatedAt: viz.updatedAt.toISOString(),
    })),
    dataset: dashboard.dataset
      ? {
          id: dashboard.dataset.id,
          name: dashboard.dataset.name,
          description: dashboard.dataset.description,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: dashboard.dataset.data as any[],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          schema: dashboard.dataset.schema as Record<string, any>,
          dataEntries: dashboard.dataset.dataEntries?.map((entry) => ({
            ...entry,
            date: entry.date.toISOString(),
            createdAt: entry.createdAt.toISOString(),
            updatedAt: entry.updatedAt.toISOString(),
          })),
        }
      : undefined,
    shares: dashboard.shares.map((share) => ({
      id: share.id,
      userId: share.userId,
      user: share.user,
    })),
  };

  return (
    <div className="container mx-auto py-8">
      <DashboardView
        dashboard={clientDashboard}
        currentUser={user}
        canEdit={isOwner || isAdmin}
      />
    </div>
  );
}
