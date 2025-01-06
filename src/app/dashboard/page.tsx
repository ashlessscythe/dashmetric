"use client";

import { Header } from "../../components/header";
import { useSession } from "next-auth/react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <main className="flex-1 py-8">
          <div className="space-y-8">
            {/* Header Section */}
            <div>
              <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, {session?.user?.name || session?.user?.email}
              </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder Cards - Will be replaced with actual metrics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Daily Metrics</h3>
                <p className="text-muted-foreground">
                  Track your daily performance metrics here
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Weekly Summary</h3>
                <p className="text-muted-foreground">
                  View your weekly performance summary
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
                <p className="text-muted-foreground">
                  Access your monthly performance report
                </p>
              </Card>
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
}
