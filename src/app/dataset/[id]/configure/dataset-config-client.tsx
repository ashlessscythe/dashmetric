"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChartType } from "@prisma/client";
import { Loader2 } from "lucide-react";

interface SchemaField {
  type: string;
  isDate?: boolean;
  isCarrier?: boolean;
  isDispatcher?: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Dataset {
  id: string;
  name: string;
  description: string | null;
  data: any[];
  schema: Record<string, SchemaField>;
  file: {
    id: string;
    originalName: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DatasetConfigClientProps {
  dataset: Dataset;
  user: User;
}

interface FieldMapping {
  field: string;
  displayName: string;
  selected: boolean;
  chartType: ChartType;
  axis: "x" | "y" | null;
}

export function DatasetConfigClient({
  dataset,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user,
}: DatasetConfigClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardName, setDashboardName] = useState(
    `${dataset.name} Dashboard`
  );
  const [dashboardDescription, setDashboardDescription] = useState(
    `Dashboard created from ${dataset.name} dataset`
  );

  // Initialize field mappings from schema
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(() => {
    const mappings: FieldMapping[] = [];

    // First, add date fields (they're usually good for x-axis)
    Object.entries(dataset.schema).forEach(([field, info]) => {
      if (info.isDate) {
        mappings.push({
          field,
          displayName: field,
          selected: true,
          chartType: "BAR",
          axis: "x",
        });
      }
    });

    // Then add carrier fields (they're usually good for grouping)
    Object.entries(dataset.schema).forEach(([field, info]) => {
      if (info.isCarrier) {
        mappings.push({
          field,
          displayName: field,
          selected: true,
          chartType: "PIE",
          axis: null,
        });
      }
    });

    // Add numeric fields (they're usually good for y-axis)
    const sampleData = dataset.data[0] || {};
    Object.entries(sampleData).forEach(([field, value]) => {
      if (
        typeof value === "number" &&
        !mappings.some((m) => m.field === field)
      ) {
        mappings.push({
          field,
          displayName: field,
          selected: true,
          chartType: "BAR",
          axis: "y",
        });
      }
    });

    // Add remaining fields
    Object.keys(dataset.schema).forEach((field) => {
      if (!mappings.some((m) => m.field === field)) {
        mappings.push({
          field,
          displayName: field,
          selected: false,
          chartType: "BAR",
          axis: null,
        });
      }
    });

    return mappings;
  });

  const toggleFieldSelection = (index: number) => {
    setFieldMappings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      };
      return updated;
    });
  };

  const updateFieldDisplayName = (index: number, displayName: string) => {
    setFieldMappings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        displayName,
      };
      return updated;
    });
  };

  const updateFieldChartType = (index: number, chartType: ChartType) => {
    setFieldMappings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        chartType,
      };
      return updated;
    });
  };

  const updateFieldAxis = (index: number, axis: "x" | "y" | null) => {
    setFieldMappings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        axis,
      };
      return updated;
    });
  };

  const createDashboard = async () => {
    setIsLoading(true);

    try {
      // Get selected fields
      const selectedFields = fieldMappings.filter(
        (mapping) => mapping.selected
      );

      if (selectedFields.length === 0) {
        toast.error("Please select at least one field for visualization");
        setIsLoading(false);
        return;
      }

      // Create visualizations based on selected fields
      const visualizations = [];

      // Create a bar chart for date fields with numeric values
      const dateFields = selectedFields.filter(
        (field) => dataset.schema[field.field]?.isDate && field.axis === "x"
      );
      const numericFields = selectedFields.filter(
        (field) =>
          typeof dataset.data[0]?.[field.field] === "number" &&
          field.axis === "y"
      );

      if (dateFields.length > 0 && numericFields.length > 0) {
        visualizations.push({
          name: "Daily Trends",
          type: "BAR",
          config: {
            xAxis: dateFields[0].field,
            yAxis: numericFields.map((field) => field.field),
            displayNames: Object.fromEntries(
              selectedFields.map((field) => [field.field, field.displayName])
            ),
          },
        });
      }

      // Create a pie chart for carrier distribution
      const carrierFields = selectedFields.filter(
        (field) => dataset.schema[field.field]?.isCarrier
      );

      if (carrierFields.length > 0) {
        visualizations.push({
          name: "Carrier Distribution",
          type: "PIE",
          config: {
            field: carrierFields[0].field,
            displayName: carrierFields[0].displayName,
          },
        });
      }

      // Create a dashboard with the visualizations
      const response = await fetch("/api/dashboards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dashboardName,
          description: dashboardDescription,
          datasetId: dataset.id,
          visualizations: visualizations,
          fieldMappings: selectedFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create dashboard");
      }

      const data = await response.json();
      toast.success("Dashboard created successfully");

      // Navigate to the new dashboard
      router.push(`/dashboard/${data.id}`);
    } catch (error) {
      console.error("Error creating dashboard:", error);
      toast.error("Failed to create dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dataset Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium">{dataset.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Original File
            </p>
            <p className="font-medium">{dataset.file.originalName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Number of Records
            </p>
            <p className="font-medium">{dataset.data.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Number of Fields
            </p>
            <p className="font-medium">{Object.keys(dataset.schema).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Settings</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="dashboardName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Dashboard Name
            </label>
            <input
              type="text"
              id="dashboardName"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="dashboardDescription"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Dashboard Description
            </label>
            <textarea
              id="dashboardDescription"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select the fields you want to include in your dashboard and configure
          how they should be displayed.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Field
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Display Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Chart Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Axis
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Include
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {fieldMappings.map((mapping, index) => (
                <tr key={mapping.field}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {mapping.field}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="text"
                      value={mapping.displayName}
                      onChange={(e) =>
                        updateFieldDisplayName(index, e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={mapping.chartType}
                      onChange={(e) =>
                        updateFieldChartType(index, e.target.value as ChartType)
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    >
                      <option value="BAR">Bar Chart</option>
                      <option value="LINE">Line Chart</option>
                      <option value="PIE">Pie Chart</option>
                      <option value="AREA">Area Chart</option>
                      <option value="SCATTER">Scatter Plot</option>
                      <option value="TABLE">Table</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={mapping.axis || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFieldAxis(
                          index,
                          value === "" ? null : (value as "x" | "y")
                        );
                      }}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                    >
                      <option value="">None</option>
                      <option value="x">X-Axis</option>
                      <option value="y">Y-Axis</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <input
                      type="checkbox"
                      checked={mapping.selected}
                      onChange={() => toggleFieldSelection(index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={createDashboard}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Dashboard...
            </>
          ) : (
            "Create Dashboard"
          )}
        </Button>
      </div>
    </div>
  );
}
