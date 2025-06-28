
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  examDate?: string;
  examTime?: string;
  status: 'draft' | 'scheduled' | 'published';
}

const SubjectManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      code: 'MATH101',
      name: 'Calculus I',
      description: 'Differential and integral calculus fundamentals',
      duration: 120,
      totalMarks: 100,
      examDate: '2024-02-15',
      examTime: '09:00',
      status: 'published'
    },
    {
      id: '2',
      code: 'CS101',
      name: 'Programming Fundamentals',
      description: 'Basic programming concepts and problem solving',
      duration: 180,
      totalMarks: 120,
      examDate: '2024-02-17',
      examTime: '14:00',
      status: 'scheduled'
    }
  ]);

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    code: '',
    name: '',
    description: '',
    duration: 120,
    totalMarks: 100,
    status: 'draft'
  });

  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in subject code and name",
        variant: "destructive",
      });
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      code: newSubject.code!,
      name: newSubject.name!,
      description: newSubject.description || '',
      duration: newSubject.duration || 120,
      totalMarks: newSubject.totalMarks || 100,
      examDate: newSubject.examDate,
      examTime: newSubject.examTime,
      status: newSubject.status || 'draft'
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      code: '',
      name: '',
      description: '',
      duration: 120,
      totalMarks: 100,
      status: 'draft'
    });

    toast({
      title: "Subject Added",
      description: "New subject has been created successfully",
    });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast({
      title: "Subject Deleted",
      description: "Subject has been removed",
    });
  };

  const handlePublishSubject = (id: string) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, status: 'published' as const } : s
    ));
    toast({
      title: "Subject Published",
      description: "Subject is now available for students",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Subject</span>
          </CardTitle>
          <CardDescription>Create a new exam subject with schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectCode">Subject Code</Label>
              <Input
                id="subjectCode"
                placeholder="e.g., MATH101"
                value={newSubject.code}
                onChange={(e) => setNewSubject({...newSubject, code: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                placeholder="e.g., Calculus I"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief subject description"
              value={newSubject.description}
              onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newSubject.duration}
                onChange={(e) => setNewSubject({...newSubject, duration: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                value={newSubject.totalMarks}
                onChange={(e) => setNewSubject({...newSubject, totalMarks: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={newSubject.examDate}
                onChange={(e) => setNewSubject({...newSubject, examDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examTime">Exam Time</Label>
              <Input
                id="examTime"
                type="time"
                value={newSubject.examTime}
                onChange={(e) => setNewSubject({...newSubject, examTime: e.target.value})}
              />
            </div>
          </div>

          <Button onClick={handleAddSubject} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects ({subjects.length})</CardTitle>
          <CardDescription>Manage exam subjects and schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <Badge className={`${getStatusColor(subject.status)} border-0`}>
                      {subject.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{subject.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{subject.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{subject.totalMarks} marks</Badge>
                    </div>
                  </div>

                  {subject.examDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{subject.examDate} at {subject.examTime}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {subject.status === 'draft' && (
                      <Button size="sm" onClick={() => handlePublishSubject(subject.id)}>
                        Publish
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleDeleteSubject(subject.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectManager;
