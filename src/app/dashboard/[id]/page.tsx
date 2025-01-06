import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard | DashMetric",
  description: "View and manage your dashboard",
};

interface DashboardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const dashboard = await prisma.dashboard.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      metrics: true,
    },
  });

  if (!dashboard) {
    redirect("/dashboard");
  }

  return <DashboardView dashboard={dashboard} />;
}
