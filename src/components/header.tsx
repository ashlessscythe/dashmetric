"use client";

import Link from "next/link";
import { BarChart3Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3Icon className="h-6 w-6" />
            <Link href="/" className="text-2xl font-bold">
              DashMetric
            </Link>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3Icon className="h-6 w-6" />
          <Link href="/" className="text-2xl font-bold">
            DashMetric
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            {session ? (
              <Button variant="destructive" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
