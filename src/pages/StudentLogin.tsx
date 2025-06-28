
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, BookOpen, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [studentId, setStudentId] = useState("");
  const [examCode, setExamCode] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [step, setStep] = useState(1); // 1: Login, 2: Subject Selection
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subjects = [
    { code: "MATH101", name: "Calculus I" },
    { code: "PHY101", name: "Physics I" },
    { code: "CS101", name: "Programming Fundamentals" },
    { code: "ENG101", name: "English Composition" },
    { code: "STAT101", name: "Statistics" },
    { code: "CHEM101", name: "General Chemistry" }
  ];

  const validateStudentId = (id: string) => {
    // Format: FA21-BSE-024 (Session-Program-Number)
    const pattern = /^(FA|SP)\d{2}-(BSE|BME|BCS|BEE)-\d{3}$/;
    return pattern.test(id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateStudentId(studentId)) {
      toast({
        title: "Invalid Student ID",
        description: "Please enter a valid Student ID format (e.g., FA21-BSE-024)",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Simulate authentication
    setTimeout(() => {
      if (studentId && examCode) {
        toast({
          title: "Authentication Successful",
          description: "Please select your subject",
        });
        setStep(2);
      } else {
        toast({
          title: "Authentication Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1500);
  };

  const handleSubjectSelection = () => {
    if (selectedSubject) {
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('selectedSubject', selectedSubject);
      toast({
        title: "Subject Selected",
        description: "Redirecting to exam interface...",
      });
      navigate("/student/exam");
    } else {
      toast({
        title: "Subject Required",
        description: "Please select a subject to continue",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ProctorWatch</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Portal</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Enter your credentials to access the exam" : "Select your exam subject"}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 1 ? <User className="h-8 w-8 text-primary" /> : <BookOpen className="h-8 w-8 text-primary" />}
            </div>
            <CardTitle>{step === 1 ? "Exam Authentication" : "Subject Selection"}</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Please verify your identity before starting the proctored exam"
                : "Choose the subject you want to attempt"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Student ID Format:</p>
                      <p>Session-Program-Number</p>
                      <p className="mt-2"><strong>Examples:</strong></p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>FA21-BSE-024 (Fall 2021, Software Engineering)</li>
                        <li>SP22-BCS-045 (Spring 2022, Computer Science)</li>
                        <li>FA23-BME-012 (Fall 2023, Mechanical Engineering)</li>
                      </ul>
                      <p className="mt-2 text-xs">Your Student ID is printed on your admit card</p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="e.g., FA21-BSE-024"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examCode">Exam Code</Label>
                    <Input
                      id="examCode"
                      type="text"
                      placeholder="Enter exam access code from admit card"
                      value={examCode}
                      onChange={(e) => setExamCode(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Authenticating..." : "Authenticate"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Select Subject</Label>
                  <Select onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your exam subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.code} value={subject.code}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubjectSelection} className="flex-1">
                    Start Exam
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Contact your proctor or{" "}
            <Link to="/" className="text-primary hover:underline">
              return to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
