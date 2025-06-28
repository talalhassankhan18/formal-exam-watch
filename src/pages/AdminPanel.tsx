
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Users, Monitor, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [systemStats] = useState({
    totalUsers: 1247,
    activeExams: 23,
    totalExams: 156,
    alertsToday: 47,
    systemUptime: "99.9%"
  });

  const [alloyModels] = useState([
    {
      id: 1,
      name: "Basic Cheating Detection",
      version: "1.2.0",
      status: "active",
      lastUpdated: "2024-01-15",
      description: "Detects gaze deviation and tab switching patterns"
    },
    {
      id: 2,
      name: "Advanced Behavioral Analysis", 
      version: "2.0.1",
      status: "active",
      lastUpdated: "2024-01-20",
      description: "Complex multi-factor cheating behavior detection"
    },
    {
      id: 3,
      name: "Audio Pattern Recognition",
      version: "1.0.0", 
      status: "draft",
      lastUpdated: "2024-01-22",
      description: "Voice and sound anomaly detection model"
    }
  ]);

  const [examSettings, setExamSettings] = useState({
    maxGazeShifts: 5,
    maxTabSwitches: 3,
    alertThreshold: 3,
    recordingEnabled: true
  });

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings Updated",
      description: "Exam monitoring settings have been saved successfully",
    });
  };

  const handleModelUpload = () => {
    toast({
      title: "Model Upload",
      description: "Alloy model upload functionality would be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">System configuration and management dashboard</p>
      </div>

      {/* System Overview */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{systemStats.activeExams}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalExams}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{systemStats.alertsToday}</div>
            <p className="text-xs text-muted-foreground">Flagged behaviors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Exam Settings</TabsTrigger>
          <TabsTrigger value="models">Alloy Models</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Thresholds</CardTitle>
                <CardDescription>Configure behavioral detection sensitivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gazeShifts">Maximum Gaze Shifts</Label>
                  <Input
                    id="gazeShifts"
                    type="number"
                    value={examSettings.maxGazeShifts}
                    onChange={(e) => setExamSettings(prev => ({
                      ...prev,
                      maxGazeShifts: parseInt(e.target.value)
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tabSwitches">Maximum Tab Switches</Label>
                  <Input
                    id="tabSwitches"
                    type="number"
                    value={examSettings.maxTabSwitches}
                    onChange={(e) => setExamSettings(prev => ({
                      ...prev,
                      maxTabSwitches: parseInt(e.target.value)
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Alert Threshold</Label>
                  <Input
                    id="alertThreshold"
                    type="number"
                    value={examSettings.alertThreshold}
                    onChange={(e) => setExamSettings(prev => ({
                      ...prev,
                      alertThreshold: parseInt(e.target.value)
                    }))}
                  />
                </div>
                <Button onClick={handleSettingsUpdate} className="w-full">
                  Update Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recording Settings</CardTitle>
                <CardDescription>Configure exam recording and storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="recording">Enable Recording</Label>
                  <input
                    id="recording"
                    type="checkbox"
                    checked={examSettings.recordingEnabled}
                    onChange={(e) => setExamSettings(prev => ({
                      ...prev,
                      recordingEnabled: e.target.checked
                    }))}
                    className="h-4 w-4"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Storage Duration</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                    <option>1 year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Video Quality</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>720p</option>
                    <option>1080p</option>
                    <option>480p</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alloy Verification Models</CardTitle>
                  <CardDescription>Manage formal verification models for behavior detection</CardDescription>
                </div>
                <Button onClick={handleModelUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Model
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alloyModels.map((model) => (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                          {model.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Version: {model.version}</span>
                      <span>Updated: {model.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage student and proctor accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input placeholder="Search users..." className="max-w-sm" />
                  <Button>Add User</Button>
                </div>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4">Alice Johnson</td>
                        <td className="p-4">STU001</td>
                        <td className="p-4">Student</td>
                        <td className="p-4"><Badge>Active</Badge></td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-4">Prof. Smith</td>
                        <td className="p-4">PRO001</td>
                        <td className="p-4">Proctor</td>
                        <td className="p-4"><Badge>Active</Badge></td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>Monitor system events and user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input placeholder="Search logs..." className="max-w-sm" />
                  <select className="p-2 border rounded-md">
                    <option>All Events</option>
                    <option>Login Events</option>
                    <option>Exam Events</option>
                    <option>Alert Events</option>
                  </select>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[
                    { time: "14:23:45", event: "Student STU002 started exam", type: "info" },
                    { time: "14:22:13", event: "High risk alert for STU002", type: "warning" },
                    { time: "14:21:02", event: "Proctor logged in", type: "info" },
                    { time: "14:20:15", event: "Tab switch detected - STU004", type: "warning" },
                    { time: "14:19:33", event: "System backup completed", type: "success" },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-secondary/20 rounded">
                      <span className="text-sm font-mono text-muted-foreground">{log.time}</span>
                      <span className="flex-1">{log.event}</span>
                      <Badge variant={log.type === 'warning' ? 'destructive' : 'default'}>
                        {log.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
