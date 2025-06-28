
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Monitor, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">ProctorWatch</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/student/login" className="text-muted-foreground hover:text-primary transition-colors">
                Student Portal
              </Link>
              <Link to="/proctor" className="text-muted-foreground hover:text-primary transition-colors">
                Proctor Dashboard
              </Link>
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                Admin Panel
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Secure Online
            <span className="text-primary block">Exam Proctoring</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Advanced behavioral detection and formal verification methods ensure academic integrity
            in remote examinations with real-time monitoring and intelligent alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/student/login">Start Exam</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/proctor">Monitor Session</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Gaze Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time eye movement analysis to detect when students look away from the screen
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Monitor className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Tab Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track browser activity including tab switches and new window openings
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Formal Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Alloy-based behavioral modeling to verify correctness of cheating detection
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Live Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time proctor dashboard with instant alerts and comprehensive logging
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Comprehensive Proctoring Solution</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-lg font-semibold">Authentication</h4>
              <p className="text-muted-foreground">Secure student login with identity verification</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-lg font-semibold">Real-time Monitoring</h4>
              <p className="text-muted-foreground">Continuous behavioral analysis during exams</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-lg font-semibold">Analysis & Reporting</h4>
              <p className="text-muted-foreground">Comprehensive post-exam analysis and audit logs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 ProctorWatch. Ensuring academic integrity through advanced monitoring technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
