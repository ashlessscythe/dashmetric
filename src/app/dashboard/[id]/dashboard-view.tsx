"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChartType, UserRole } from "@prisma/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Share, Edit, Trash, Download, RefreshCw } from "lucide-react";

// Define types for our components
interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

// Define more specific types for visualization config
interface VisualizationConfig {
  xAxis?: string;
  yAxis?: string | string[];
  field?: string;
  displayNames?: Record<string, string>;
  columns?: string[];
  [key: string]: unknown;
}

interface Visualization {
  id: string;
  name: string;
  description?: string | null;
  type: ChartType;
  config: VisualizationConfig;
  dataConfig: Record<string, unknown>;
  position: number;
  size: string;
  dashboardId: string;
}

// Define more specific types for dataset items
interface DatasetItem {
  [key: string]: string | number | boolean | null;
}

interface Dataset {
  id: string;
  name: string;
  description?: string | null;
  data: DatasetItem[];
  schema: Record<string, unknown>;
  dataEntries?: DatasetItem[];
}

interface Dashboard {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  visualizations: Visualization[];
  dataset?: Dataset;
  shares: Array<{
    id: string;
    userId: string;
    user: User;
  }>;
}

interface DashboardViewProps {
  dashboard: Dashboard;
  currentUser: User;
  canEdit: boolean;
}

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

export function DashboardView({
  dashboard,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentUser,
  canEdit,
}: DashboardViewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  const handleDelete = async () => {
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
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast.error("Failed to delete dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSharing(true);

    try {
      const response = await fetch(`/api/dashboards/${dashboard.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: shareEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share dashboard");
      }

      toast.success(`Dashboard shared with ${shareEmail}`);
      setShareEmail("");
      router.refresh();
    } catch (error) {
      console.error("Error sharing dashboard:", error);
      toast.error("Failed to share dashboard");
    } finally {
      setIsSharing(false);
    }
  };

  const handleExport = () => {
    // Create a JSON file with the dashboard data
    const dataStr = JSON.stringify(dashboard, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    // Create a link element and trigger a download
    const exportFileDefaultName = `${dashboard.name.replace(
      /\s+/g,
      "_"
    )}_dashboard.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const renderVisualization = (visualization: Visualization) => {
    const { type, config } = visualization;
    const data = dashboard.dataset?.data || [];

    // Get width based on visualization size
    const getWidth = () => {
      switch (visualization.size) {
        case "sm":
          return "w-full md:w-1/3";
        case "md":
          return "w-full md:w-1/2";
        case "lg":
          return "w-full md:w-2/3";
        case "xl":
          return "w-full";
        default:
          return "w-full md:w-1/2";
      }
    };

    switch (type) {
      case "BAR":
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={config.xAxis}
                      label={{
                        value:
                          config.displayNames?.[config.xAxis] || config.xAxis,
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.isArray(config.yAxis) ? (
                      config.yAxis.map((field: string, index: number) => (
                        <Bar
                          key={field}
                          dataKey={field}
                          name={config.displayNames?.[field] || field}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))
                    ) : (
                      <Bar
                        dataKey={config.yAxis}
                        name={
                          config.displayNames?.[config.yAxis] || config.yAxis
                        }
                        fill={COLORS[0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "LINE":
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={config.xAxis}
                      label={{
                        value:
                          config.displayNames?.[config.xAxis] || config.xAxis,
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.isArray(config.yAxis) ? (
                      config.yAxis.map((field: string, index: number) => (
                        <Line
                          key={field}
                          type="monotone"
                          dataKey={field}
                          name={config.displayNames?.[field] || field}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))
                    ) : (
                      <Line
                        type="monotone"
                        dataKey={config.yAxis}
                        name={
                          config.displayNames?.[config.yAxis] || config.yAxis
                        }
                        stroke={COLORS[0]}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "PIE":
        // For pie charts, we need to transform the data
        const pieData = data.reduce(
          (acc: Array<{ name: string; value: number }>, item: DatasetItem) => {
            const field = config.field || "";
            const value = item[field];

            if (value) {
              const existingItem = acc.find((i) => i.name === value);
              if (existingItem) {
                existingItem.value += 1;
              } else {
                acc.push({
                  name: String(value),
                  value: 1,
                });
              }
            }

            return acc;
          },
          []
        );

        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "AREA":
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={config.xAxis}
                      label={{
                        value:
                          config.displayNames?.[config.xAxis] || config.xAxis,
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {Array.isArray(config.yAxis) ? (
                      config.yAxis.map((field: string, index: number) => (
                        <Area
                          key={field}
                          type="monotone"
                          dataKey={field}
                          name={config.displayNames?.[field] || field}
                          fill={COLORS[index % COLORS.length]}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))
                    ) : (
                      <Area
                        type="monotone"
                        dataKey={config.yAxis}
                        name={
                          config.displayNames?.[config.yAxis] || config.yAxis
                        }
                        fill={COLORS[0]}
                        stroke={COLORS[0]}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "SCATTER":
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={config.xAxis}
                      name={config.displayNames?.[config.xAxis] || config.xAxis}
                      type="number"
                    />
                    <YAxis
                      dataKey={config.yAxis}
                      name={config.displayNames?.[config.yAxis] || config.yAxis}
                      type="number"
                    />
                    <ZAxis range={[100, 100]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name={`${
                        config.displayNames?.[config.xAxis] || config.xAxis
                      } vs ${
                        config.displayNames?.[config.yAxis] || config.yAxis
                      }`}
                      data={data}
                      fill={COLORS[0]}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "TABLE":
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      {config.columns?.map((column: string) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {config.displayNames?.[column] || column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.slice(0, 10).map((item: any, index: number) => (
                      <tr key={index}>
                        {config.columns?.map((column: string) => (
                          <td
                            key={column}
                            className="px-6 py-4 whitespace-nowrap text-sm"
                          >
                            {item[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={visualization.id} className={`${getWidth()} p-4`}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                {visualization.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Unsupported visualization type: {type}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{dashboard.name}</h1>
          {dashboard.description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {dashboard.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/${dashboard.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {canEdit && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Share Dashboard</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            />
            <Button onClick={handleShare} disabled={isSharing || !shareEmail}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          {dashboard.shares.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Shared with:</h3>
              <ul className="space-y-1">
                {dashboard.shares.map((share) => (
                  <li
                    key={share.id}
                    className="text-sm flex items-center justify-between"
                  >
                    <span>
                      {share.user.name} ({share.user.email})
                    </span>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-red-500 hover:text-red-700"
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `/api/dashboards/${dashboard.id}/share/${share.id}`,
                              {
                                method: "DELETE",
                              }
                            );
                            if (!response.ok) {
                              throw new Error("Failed to remove share");
                            }
                            toast.success("Share removed successfully");
                            router.refresh();
                          } catch (error) {
                            console.error("Error removing share:", error);
                            toast.error("Failed to remove share");
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap -mx-4">
        {dashboard.visualizations.length > 0 ? (
          dashboard.visualizations.map((visualization) =>
            renderVisualization(visualization)
          )
        ) : (
          <div className="w-full p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">
                No visualizations yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                This dashboard doesn&apos;t have any visualizations yet.
              </p>
              {canEdit && (
                <Button
                  onClick={() => router.push(`/dashboard/${dashboard.id}/edit`)}
                >
                  Add Visualization
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
