"use client";

import Link from "next/link";
import { BarChart3Icon, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";
import { Container } from "./ui/container";

export function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "DashMetric";

  if (status === "loading") {
    return (
      <header className="border-b">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3Icon className="h-6 w-6" />
              <Link href="/" className="text-2xl font-bold">
                <span className="gradient-text">{appName}</span>
              </Link>
            </div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="border-b relative">
      <Container>
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3Icon className="h-6 w-6" />
            <Link href="/" className="text-2xl font-bold">
              <span className="gradient-text">{appName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <div className="flex flex-col gap-2">
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
        )}
      </Container>
    </header>
  );
}
