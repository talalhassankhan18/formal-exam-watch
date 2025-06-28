import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import QuestionManager from "@/components/QuestionManager";
import AdminDashboard from "@/components/AdminDashboard";
import SubjectManager from "@/components/SubjectManager";
import ExamMonitor from "@/components/ExamMonitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      {/* Main Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard systemStats={systemStats} />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectManager />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionManager />
        </TabsContent>

        <TabsContent value="monitor">
          <ExamMonitor />
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
      </Tabs>
    </div>
  );
};

export default AdminPanel;
