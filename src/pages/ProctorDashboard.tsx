
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertTriangle, Eye, Monitor, Clock, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProctorDashboard = () => {
  const [students] = useState([
    {
      id: "STU001",
      name: "Alice Johnson",
      exam: "Mathematics Final",
      status: "active",
      timeRemaining: 2850,
      alerts: { gazeShift: 2, tabSwitch: 1, multiplePeople: false },
      riskLevel: "low"
    },
    {
      id: "STU002", 
      name: "Bob Smith",
      exam: "Mathematics Final",
      status: "active",
      timeRemaining: 2920,
      alerts: { gazeShift: 5, tabSwitch: 3, multiplePeople: true },
      riskLevel: "high"
    },
    {
      id: "STU003",
      name: "Carol Davis",
      exam: "Mathematics Final", 
      status: "active",
      timeRemaining: 2780,
      alerts: { gazeShift: 1, tabSwitch: 0, multiplePeople: false },
      riskLevel: "low"
    },
    {
      id: "STU004",
      name: "David Wilson",
      exam: "Mathematics Final",
      status: "active", 
      timeRemaining: 2650,
      alerts: { gazeShift: 4, tabSwitch: 2, multiplePeople: false },
      riskLevel: "medium"
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      studentId: "STU002",
      studentName: "Bob Smith",
      type: "Multiple People Detected",
      severity: "high",
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: 2,
      studentId: "STU002", 
      studentName: "Bob Smith",
      type: "Excessive Tab Switching",
      severity: "medium",
      timestamp: new Date(Date.now() - 600000),
      resolved: false
    },
    {
      id: 3,
      studentId: "STU004",
      studentName: "David Wilson", 
      type: "Gaze Deviation",
      severity: "medium",
      timestamp: new Date(Date.now() - 900000),
      resolved: true
    }
  ]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "default";
    }
  };

  const resolveAlert = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    toast({
      title: "Alert Resolved",
      description: "Alert has been marked as resolved",
    });
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const highRiskStudents = students.filter(s => s.riskLevel === "high");
      if (highRiskStudents.length > 0 && Math.random() > 0.8) {
        toast({
          title: "High Risk Alert",
          description: `${highRiskStudents[0].name} requires immediate attention`,
          variant: "destructive",
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [students]);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Proctor Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring of active exam sessions</p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">Currently taking exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {students.filter(s => s.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Students flagged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time Left</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(Math.floor(students.reduce((acc, s) => acc + s.timeRemaining, 0) / students.length))}
            </div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Student Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Session Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <div className="grid lg:grid-cols-2 gap-6">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>{student.id} • {student.exam}</CardDescription>
                    </div>
                    <Badge variant={getRiskBadgeVariant(student.riskLevel)}>
                      {student.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Remaining</span>
                    <Badge variant="outline">{formatTime(student.timeRemaining)}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">{student.alerts.gazeShift}</div>
                      <div className="text-xs text-muted-foreground">Gaze Shifts</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{student.alerts.tabSwitch}</div>
                      <div className="text-xs text-muted-foreground">Tab Switches</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {student.alerts.multiplePeople ? "Yes" : "No"}
                      </div>
                      <div className="text-xs text-muted-foreground">Multi-Person</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      View Live Feed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>Review and manage security alerts from active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border ${alert.resolved ? 'bg-muted/30' : 'bg-card'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === 'high' ? 'text-destructive' : 'text-warning'
                        }`} />
                        <div>
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.studentName} ({alert.studentId}) • {alert.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {!alert.resolved && (
                          <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                            Resolve
                          </Button>
                        )}
                        {alert.resolved && (
                          <Badge variant="outline">Resolved</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Overview</CardTitle>
                <CardDescription>Current exam session statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Sessions</span>
                    <span className="font-medium">{students.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Duration</span>
                    <span className="font-medium">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alert Rate</span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Behavior Patterns</CardTitle>
                <CardDescription>Common detection patterns across sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Gaze Deviation</span>
                      <span className="text-sm">65%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tab Switching</span>
                      <span className="text-sm">35%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-warning h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Multiple People</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-destructive h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProctorDashboard;
