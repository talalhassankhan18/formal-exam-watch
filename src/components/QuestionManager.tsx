
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  type: 'mcq' | 'short' | 'long';
  options?: string[];
  correctAnswer?: string;
  marks: number;
  subject: string;
}

const QuestionManager = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'What is the derivative of x²?',
      type: 'mcq',
      options: ['2x', 'x²', '2', 'x'],
      correctAnswer: '2x',
      marks: 5,
      subject: 'MATH101'
    },
    {
      id: '2',
      question: 'Explain the concept of inheritance in programming.',
      type: 'long',
      marks: 15,
      subject: 'CS101'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    type: 'mcq',
    options: ['', '', '', ''],
    marks: 5,
    subject: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const subjects = [
    { code: "MATH101", name: "Calculus I" },
    { code: "PHY101", name: "Physics I" },
    { code: "CS101", name: "Programming Fundamentals" },
    { code: "ENG101", name: "English Composition" },
    { code: "STAT101", name: "Statistics" },
    { code: "CHEM101", name: "General Chemistry" }
  ];

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      question: newQuestion.question!,
      type: newQuestion.type!,
      options: newQuestion.type === 'mcq' ? newQuestion.options : undefined,
      correctAnswer: newQuestion.correctAnswer,
      marks: newQuestion.marks!,
      subject: newQuestion.subject!
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      question: '',
      type: 'mcq',
      options: ['', '', '', ''],
      marks: 5,
      subject: ''
    });

    toast({
      title: "Question Added",
      description: "New question has been added successfully",
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast({
      title: "Question Deleted",
      description: "Question has been removed",
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  return (
    <div className="space-y-6">
      {/* Add New Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Question</span>
          </CardTitle>
          <CardDescription>Create questions for your exam papers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({...newQuestion, subject: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
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
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select value={newQuestion.type} onValueChange={(value: 'mcq' | 'short' | 'long') => setNewQuestion({...newQuestion, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="long">Long Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea 
              id="question"
              placeholder="Enter your question here..."
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
              rows={3}
            />
          </div>

          {newQuestion.type === 'mcq' && (
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="grid md:grid-cols-2 gap-2">
                {(newQuestion.options || ['', '', '', '']).map((option, index) => (
                  <Input
                    key={index}
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Select value={newQuestion.correctAnswer} onValueChange={(value) => setNewQuestion({...newQuestion, correctAnswer: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {(newQuestion.options || []).map((option, index) => (
                      <SelectItem key={index} value={option} disabled={!option}>
                        {option || `Option ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="marks">Marks</Label>
            <Input 
              id="marks"
              type="number"
              min="1"
              max="100"
              value={newQuestion.marks}
              onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
            />
          </div>

          <Button onClick={handleAddQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Question Bank ({questions.length})</CardTitle>
          <CardDescription>Manage your exam questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{question.subject}</Badge>
                      <Badge variant={question.type === 'mcq' ? 'default' : question.type === 'short' ? 'secondary' : 'destructive'}>
                        {question.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{question.marks} marks</Badge>
                    </div>
                    <p className="font-medium mb-2">{question.question}</p>
                    
                    {question.type === 'mcq' && question.options && (
                      <div className="ml-4 space-y-1">
                        {question.options.map((option, index) => (
                          <p key={index} className={`text-sm ${option === question.correctAnswer ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                            {String.fromCharCode(65 + index)}. {option}
                            {option === question.correctAnswer && ' ✓'}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No questions added yet. Create your first question above.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManager;
