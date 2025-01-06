"use client";

import { Header } from "../../components/header";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </main>
    </div>
  );
}
