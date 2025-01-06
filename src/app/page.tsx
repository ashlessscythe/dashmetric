import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Link from "next/link";
import {
  BarChart3Icon,
  LineChart,
  PieChartIcon,
  ArrowRightIcon,
  SunIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3Icon className="h-6 w-6" />
            <h1 className="text-2xl font-bold">DashMetric</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <SunIcon className="h-5 w-5" />
            </Button>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-[64rem] text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Transform Your Data into{" "}
            <span className="text-primary">Actionable Insights</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful analytics and visualization tools to help you make better
            decisions. Track metrics, generate reports, and share insights with
            your team.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/login" className="gap-2">
                Start Your Journey
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
            <Card>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </footer>
    </div>
  );
}
