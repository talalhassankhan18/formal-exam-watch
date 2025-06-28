
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SubjectSelection = () => {
  const [studentInfo, setStudentInfo] = useState({ id: '', examCode: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('studentId') || '';
    const examCode = localStorage.getItem('examCode') || '';
    
    if (!studentId || !examCode) {
      navigate('/student/login');
      return;
    }
    
    setStudentInfo({ id: studentId, examCode });
  }, [navigate]);

  const subjects = [
    {
      code: "MATH101",
      name: "Calculus I",
      examDate: "2024-02-15",
      examTime: "09:00 AM",
      duration: "2 hours",
      totalQuestions: 25,
      totalMarks: 100,
      status: "upcoming",
      description: "Differential and integral calculus fundamentals"
    },
    {
      code: "PHY101",
      name: "Physics I",
      examDate: "2024-02-16",
      examTime: "11:00 AM",
      duration: "2.5 hours",
      totalQuestions: 30,
      totalMarks: 120,
      status: "upcoming",
      description: "Mechanics, thermodynamics, and wave motion"
    },
    {
      code: "CS101",
      name: "Programming Fundamentals",
      examDate: "2024-02-17",
      examTime: "02:00 PM",
      duration: "3 hours",
      totalQuestions: 20,
      totalMarks: 100,
      status: "upcoming",
      description: "Basic programming concepts and problem solving"
    },
    {
      code: "ENG101",
      name: "English Composition",
      examDate: "2024-02-18",
      examTime: "10:00 AM",
      duration: "2 hours",
      totalQuestions: 15,
      totalMarks: 80,
      status: "completed",
      description: "Academic writing and communication skills"
    },
    {
      code: "STAT101",
      name: "Statistics",
      examDate: "2024-02-19",
      examTime: "01:00 PM",
      duration: "2 hours",
      totalQuestions: 25,
      totalMarks: 100,
      status: "upcoming",
      description: "Descriptive and inferential statistics"
    },
    {
      code: "CHEM101",
      name: "General Chemistry",
      examDate: "2024-02-20",
      examTime: "09:30 AM",
      duration: "2.5 hours",
      totalQuestions: 28,
      totalMarks: 110,
      status: "upcoming",
      description: "Atomic structure, bonding, and chemical reactions"
    }
  ];

  const handleSubjectSelect = (subjectCode: string) => {
    if (subjects.find(s => s.code === subjectCode)?.status === 'completed') {
      toast({
        title: "Exam Completed",
        description: "You have already completed this exam",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('selectedSubject', subjectCode);
    toast({
      title: "Subject Selected",
      description: "Redirecting to exam interface...",
    });
    navigate("/student/exam");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/student/login" className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Login</span>
          </Link>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-semibold">{studentInfo.id}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Select Your Exam Subject</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the subject you want to attempt. Make sure you have your admit card and required materials ready.
          </p>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.code} className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={`${getStatusColor(subject.status)} border-0`}>
                    {subject.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{subject.name}</CardTitle>
                <CardDescription className="text-sm">{subject.description}</CardDescription>
                <div className="text-xs font-medium text-muted-foreground">
                  Code: {subject.code}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{formatDate(subject.examDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{subject.examTime}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-secondary/20 rounded-lg text-xs">
                  <div className="text-center">
                    <p className="font-medium">{subject.duration}</p>
                    <p className="text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{subject.totalQuestions}</p>
                    <p className="text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{subject.totalMarks}</p>
                    <p className="text-muted-foreground">Marks</p>
                  </div>
                </div>

                <Button 
                  onClick={() => handleSubjectSelect(subject.code)}
                  disabled={subject.status === 'completed'}
                  className="w-full"
                  variant={subject.status === 'completed' ? 'secondary' : 'default'}
                >
                  {subject.status === 'completed' ? 'Completed' : 'Start Exam'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">
          Need help? Contact your proctor or{" "}
          <Link to="/" className="text-primary hover:underline">
            return to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SubjectSelection;
