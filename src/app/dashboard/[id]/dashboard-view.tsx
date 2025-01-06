"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CreateMetricDialog } from "@/components/create-metric-dialog";
import { toast } from "sonner";

interface Metric {
  id: string;
  name: string;
  description: string | null;
  value: number;
  target: number | null;
  unit: string | null;
}

interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  metrics: Metric[];
}

interface DashboardViewProps {
  dashboard: Dashboard;
}

export function DashboardView({ dashboard }: DashboardViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateMetricOpen, setIsCreateMetricOpen] = useState(false);
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description || "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/dashboards/${dashboard.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update dashboard");
      }

      toast.success("Dashboard updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this dashboard?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/dashboards/${dashboard.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dashboard");
      }

      toast.success("Dashboard deleted successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete dashboard");
      setIsLoading(false);
    }
  }

  async function handleDeleteMetric(metricId: string) {
    if (!confirm("Are you sure you want to delete this metric?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/dashboards/${dashboard.id}/metrics?metricId=${metricId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete metric");
      }

      toast.success("Metric deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete metric");
    }
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4">
            ← Back to Dashboards
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Dashboard name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{dashboard.name}</h1>
              {dashboard.description && (
                <p className="text-muted-foreground">{dashboard.description}</p>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Edit Dashboard
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete Dashboard
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Metrics</h2>
          <Button onClick={() => setIsCreateMetricOpen(true)}>
            Add Metric
          </Button>
        </div>

        {dashboard.metrics.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No metrics yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first metric to start tracking
            </p>
            <Button onClick={() => setIsCreateMetricOpen(true)}>
              Add Your First Metric
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dashboard.metrics.map((metric) => (
              <Card key={metric.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{metric.name}</h3>
                    {metric.description && (
                      <p className="text-muted-foreground">
                        {metric.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleDeleteMetric(metric.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Value</span>
                    <span className="font-medium">
                      {metric.value}
                      {metric.unit && ` ${metric.unit}`}
                    </span>
                  </div>
                  {metric.target && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target</span>
                      <span className="font-medium">
                        {metric.target}
                        {metric.unit && ` ${metric.unit}`}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateMetricDialog
        dashboardId={dashboard.id}
        isOpen={isCreateMetricOpen}
        onClose={() => setIsCreateMetricOpen(false)}
      />
    </Container>
  );
}
