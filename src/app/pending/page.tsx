"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/header";
import { Container } from "@/components/ui/container";
import { useSession } from "next-auth/react";

export default function PendingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Container>
        <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
            <div className="absolute inset-0 bg-primary/10 transform -skew-y-3 rounded-3xl" />
            <Card className="relative">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">
                  Account Pending Approval
                </CardTitle>
                <CardDescription>
                  Thank you for registering! Your account is currently pending
                  administrator approval.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our team is reviewing your registration for{" "}
                  {session?.user?.email}. This process typically takes 1-2
                  business days. You will receive an email notification once
                  your account has been approved.
                </p>
                <div className="text-center">
                  <Button asChild variant="outline">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </Container>
    </div>
  );
}
