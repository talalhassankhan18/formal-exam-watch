
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Eye, Monitor, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const StudentExam = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [behaviorFlags, setBehaviorFlags] = useState({
    gazeShift: 0,
    tabSwitch: 0,
    multiplePeople: false,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraEnabled(true);
        toast({
          title: "Camera Initialized",
          description: "Webcam access granted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access to continue",
        variant: "destructive",
      });
    }
  };

  // Monitor tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && examStarted) {
        setBehaviorFlags(prev => ({
          ...prev,
          tabSwitch: prev.tabSwitch + 1
        }));
        toast({
          title: "Tab Switch Detected",
          description: "Please stay focused on the exam",
          variant: "destructive",
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examStarted]);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startExam = () => {
    if (cameraEnabled) {
      setExamStarted(true);
      toast({
        title: "Exam Started",
        description: "You are now being monitored. Good luck!",
      });
    } else {
      toast({
        title: "Camera Required",
        description: "Please enable camera access first",
        variant: "destructive",
      });
    }
  };

  const simulateGazeShift = () => {
    setBehaviorFlags(prev => ({
      ...prev,
      gazeShift: prev.gazeShift + 1
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mathematics Final Exam</h1>
          <p className="text-muted-foreground">Spring 2024 • Duration: 60 minutes</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={examStarted ? "default" : "secondary"} className="px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(timeRemaining)}
          </Badge>
          <Badge variant={cameraEnabled ? "default" : "destructive"} className="px-3 py-1">
            {cameraEnabled ? <Camera className="h-4 w-4 mr-1" /> : <CameraOff className="h-4 w-4 mr-1" />}
            Camera {cameraEnabled ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Exam Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Exam Questions</CardTitle>
              <CardDescription>Answer all questions to the best of your ability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!examStarted ? (
                <div className="text-center py-12">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ready to Begin?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Make sure your camera is enabled and you're in a quiet environment. 
                      You will be monitored throughout the exam.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={initializeCamera} disabled={cameraEnabled}>
                        {cameraEnabled ? "Camera Ready" : "Enable Camera"}
                      </Button>
                      <Button onClick={startExam} disabled={!cameraEnabled}>
                        Start Exam
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Question 1 (25 points)</h4>
                    <p className="mb-4">
                      Solve the quadratic equation: x² - 5x + 6 = 0
                    </p>
                    <textarea 
                      className="w-full h-24 p-3 border rounded-md resize-none"
                      placeholder="Enter your solution here..."
                    />
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Question 2 (25 points)</h4>
                    <p className="mb-4">
                      Find the derivative of f(x) = 3x³ - 2x² + x - 5
                    </p>
                    <textarea 
                      className="w-full h-24 p-3 border rounded-md resize-none"
                      placeholder="Enter your solution here..."
                    />
                  </div>

                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Question 3 (50 points)</h4>
                    <p className="mb-4">
                      Prove that the sum of the first n natural numbers is n(n+1)/2
                    </p>
                    <textarea 
                      className="w-full h-32 p-3 border rounded-md resize-none"
                      placeholder="Enter your proof here..."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Panel */}
        <div className="space-y-4">
          {/* Webcam Feed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Live Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-32 bg-gray-900 rounded-lg object-cover"
                />
                {!cameraEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                    <CameraOff className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                {cameraEnabled && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Behavior Monitoring */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Behavior Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Gaze Shifts</span>
                </div>
                <Badge variant={behaviorFlags.gazeShift > 3 ? "destructive" : "secondary"}>
                  {behaviorFlags.gazeShift}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tab Switches</span>
                </div>
                <Badge variant={behaviorFlags.tabSwitch > 2 ? "destructive" : "secondary"}>
                  {behaviorFlags.tabSwitch}
                </Badge>
              </div>

              {examStarted && (
                <div className="pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={simulateGazeShift}
                    className="w-full text-xs"
                  >
                    Simulate Gaze Detection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exam Controls */}
          {examStarted && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Exam Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full mb-2" size="sm">
                  Submit Exam
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Make sure to review your answers before submitting
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExam;
