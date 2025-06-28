
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Clock, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BehaviorMonitor from "@/components/BehaviorMonitor";
import { behaviorAnalyzer, CheatingPattern } from "@/utils/formalVerification";

const StudentExam = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [studentInfo, setStudentInfo] = useState({ id: '', subject: '' });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load student info from localStorage
  useEffect(() => {
    const studentId = localStorage.getItem('studentId') || '';
    const selectedSubject = localStorage.getItem('selectedSubject') || '';
    setStudentInfo({ id: studentId, subject: selectedSubject });
  }, []);

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
        behaviorAnalyzer.addTransition({ tabStatus: 'switched' }, 'tab_switch_detected');
        toast({
          title: "Tab Switch Detected",
          description: "Please stay focused on the exam",
          variant: "destructive",
        });
      } else if (!document.hidden && examStarted) {
        behaviorAnalyzer.addTransition({ tabStatus: 'focused' }, 'tab_focus_restored');
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
      // Initialize behavioral state
      behaviorAnalyzer.addTransition({ 
        gazeDirection: 'forward', 
        tabStatus: 'focused', 
        audioLevel: 'normal' 
      }, 'exam_started');
      
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

  const handleViolationDetected = (pattern: CheatingPattern) => {
    toast({
      title: `Violation Detected: ${pattern.name}`,
      description: pattern.description,
      variant: "destructive",
    });
  };

  const getSubjectName = (code: string) => {
    const subjects: { [key: string]: string } = {
      'MATH101': 'Calculus I',
      'PHY101': 'Physics I',
      'CS101': 'Programming Fundamentals',
      'ENG101': 'English Composition',
      'STAT101': 'Statistics',
      'CHEM101': 'General Chemistry'
    };
    return subjects[code] || code;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{getSubjectName(studentInfo.subject)} Exam</h1>
          <p className="text-muted-foreground">
            Student: {studentInfo.id} • Duration: 60 minutes
          </p>
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
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Exam Questions</span>
              </CardTitle>
              <CardDescription>Answer all questions to the best of your ability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!examStarted ? (
                <div className="text-center py-12">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ready to Begin?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Make sure your camera is enabled and you're in a quiet environment. 
                      You will be monitored throughout the exam using advanced behavioral analysis.
                    </p>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
                      <h4 className="font-semibold text-blue-800 mb-2">Monitoring Information</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Eye movement and gaze tracking</li>
                        <li>• Browser tab activity monitoring</li>
                        <li>• Audio level analysis</li>
                        <li>• Formal verification of behavior patterns</li>
                      </ul>
                    </div>
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
                      {studentInfo.subject === 'MATH101' ? 
                        'Solve the quadratic equation: x² - 5x + 6 = 0' :
                        studentInfo.subject === 'CS101' ?
                        'Write a function to implement binary search algorithm' :
                        'Analyze the given problem and provide a detailed solution'
                      }
                    </p>
                    <textarea 
                      className="w-full h-24 p-3 border rounded-md resize-none"
                      placeholder="Enter your solution here..."
                    />
                  </div>
                  
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Question 2 (25 points)</h4>
                    <p className="mb-4">
                      {studentInfo.subject === 'MATH101' ? 
                        'Find the derivative of f(x) = 3x³ - 2x² + x - 5' :
                        studentInfo.subject === 'CS101' ?
                        'Explain the time complexity of merge sort algorithm' :
                        'Discuss the key concepts and their applications'
                      }
                    </p>
                    <textarea 
                      className="w-full h-24 p-3 border rounded-md resize-none"
                      placeholder="Enter your solution here..."
                    />
                  </div>

                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Question 3 (50 points)</h4>
                    <p className="mb-4">
                      {studentInfo.subject === 'MATH101' ? 
                        'Prove that the sum of the first n natural numbers is n(n+1)/2' :
                        studentInfo.subject === 'CS101' ?
                        'Design and implement a complete solution for the given problem scenario' :
                        'Provide a comprehensive analysis with detailed explanations and examples'
                      }
                    </p>
                    <textarea 
                      className="w-full h-32 p-3 border rounded-md resize-none"
                      placeholder="Enter your solution here..."
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
          <BehaviorMonitor 
            examStarted={examStarted} 
            onViolationDetected={handleViolationDetected}
          />

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
