"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CreateDashboardDialog } from "@/components/create-dashboard-dialog";

interface Dashboard {
  id: string;
  name: string;
  description: string | null;
}

interface DashboardClientProps {
  initialDashboards: Dashboard[];
}

export function DashboardClient({ initialDashboards }: DashboardClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboards</h1>
          <p className="text-muted-foreground">
            Create and manage your metric dashboards
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create Dashboard
        </Button>
      </div>

      {initialDashboards.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No dashboards yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first dashboard to start tracking metrics
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Your First Dashboard
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialDashboards.map((dashboard) => (
            <Card key={dashboard.id} className="p-6">
              <h2 className="text-xl font-semibold mb-2">{dashboard.name}</h2>
              {dashboard.description && (
                <p className="text-muted-foreground mb-4">
                  {dashboard.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <Link href={`/dashboard/${dashboard.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateDashboardDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Container>
  );
}
