import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DatasetConfigClient } from "./dataset-config-client";

interface DatasetConfigPageProps {
  params: {
    id: string;
  };
}

export default async function DatasetConfigPage({
  params,
}: DatasetConfigPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return notFound();
  }

  // Fetch the dataset
  const dataset = await prisma.dataset.findUnique({
    where: {
      id: params.id,
    },
    include: {
      file: true,
    },
  });

  if (!dataset) {
    return notFound();
  }

  // Fetch the user to check permissions
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
  });

  if (!user) {
    return notFound();
  }

  // Check if the user has permission to access this dataset
  const isOwner = dataset.file.userId === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return notFound();
  }

  // Convert the JSON data to the expected format for the client component
  const clientDataset = {
    id: dataset.id,
    name: dataset.name,
    description: dataset.description,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: dataset.data as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: dataset.schema as Record<string, any>,
    file: {
      id: dataset.file.id,
      originalName: dataset.file.originalName,
    },
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Configure Dataset</h1>
      <DatasetConfigClient dataset={clientDataset} user={user} />
    </div>
  );
}
