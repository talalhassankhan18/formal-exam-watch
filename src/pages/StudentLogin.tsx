
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [studentId, setStudentId] = useState("");
  const [examCode, setExamCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (studentId && examCode) {
        toast({
          title: "Authentication Successful",
          description: "Redirecting to exam interface...",
        });
        navigate("/student/exam");
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
          <p className="text-muted-foreground">Enter your credentials to access the exam</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Exam Authentication</CardTitle>
            <CardDescription>
              Please verify your identity before starting the proctored exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examCode">Exam Code</Label>
                <Input
                  id="examCode"
                  type="text"
                  placeholder="Enter exam access code"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Start Proctored Exam"}
              </Button>
            </form>
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
