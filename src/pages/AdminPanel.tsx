import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, Users, Monitor, Upload, Download, BookOpen, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import QuestionManager from "@/components/QuestionManager";

const AdminPanel = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const [systemStats] = useState({
    totalUsers: 1247,
    activeExams: 23,
    totalExams: 156,
    alertsToday: 47,
    systemUptime: "99.9%",
    totalQuestions: 342,
    publishedPapers: 28
  });

  const [examSettings, setExamSettings] = useState({
    maxGazeShifts: 5,
    maxTabSwitches: 3,
    alertThreshold: 3,
    recordingEnabled: true
  });

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminId');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate('/admin/login');
  };

  const handleSettingsUpdate = () => {
    toast({
      title: "Settings Updated",
      description: "Exam monitoring settings have been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">ExamController</h1>
              <p className="text-muted-foreground">Administrative Dashboard</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid md:grid-cols-6 gap-6 mb-8">
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
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">In question bank</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Papers</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.publishedPapers}</div>
            <p className="text-xs text-muted-foreground">Ready for exams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <QuestionManager />
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject Management</CardTitle>
              <CardDescription>Add and manage exam subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subjectCode">Subject Code</Label>
                    <Input id="subjectCode" placeholder="e.g., MATH101" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input id="subjectName" placeholder="e.g., Calculus I" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Brief subject description" />
                </div>
                <Button>Add Subject</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exam Schedule</CardTitle>
              <CardDescription>Schedule and manage exam dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="examSubject">Subject</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Select Subject</option>
                      <option>MATH101 - Calculus I</option>
                      <option>CS101 - Programming</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examDate">Exam Date</Label>
                    <Input id="examDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examTime">Exam Time</Label>
                    <Input id="examTime" type="time" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" type="number" placeholder="120" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input id="totalMarks" type="number" placeholder="100" />
                  </div>
                </div>
                <Button>Schedule Exam</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
