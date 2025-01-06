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
import {
  BarChart3Icon,
  LineChart,
  PieChartIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <Container>
          <div className="max-w-[64rem] mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Transform Your Data into{" "}
              <span className="text-primary">Actionable Insights</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful analytics and visualization tools to help you make better
              decisions. Track metrics, generate reports, and share insights
              with your team.
            </p>
            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
              <Button size="lg" asChild className="px-6 py-3 text-base">
                <Link href="/login" className="gap-2">
                  Start Your Journey
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/50">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Everything You Need
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                  <BarChart3Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track your metrics in real-time with intuitive dashboards and
                  customizable views.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Live data updates</li>
                  <li>Customizable dashboards</li>
                  <li>Performance monitoring</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Identify patterns and trends with advanced analytics and
                  visualization tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Pattern recognition</li>
                  <li>Predictive analytics</li>
                  <li>Historical data analysis</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                  <PieChartIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports and share insights with your team
                  effortlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Automated reporting</li>
                  <li>Export capabilities</li>
                  <li>Team collaboration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 mt-12 sm:mt-20">
        <Container>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3Icon className="h-6 w-6" />
                <h3 className="font-bold">DashMetric</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                © {new Date().getFullYear()} DashMetric. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <p className="text-sm text-muted-foreground">
                Unauthorized access or use of this system is strictly prohibited
                and may result in civil and criminal penalties. By accessing
                this system, you agree to comply with all applicable laws and
                regulations.
              </p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
