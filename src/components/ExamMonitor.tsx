
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, AlertTriangle, Eye, Clock, Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  subject: string;
  examStartTime: string;
  timeRemaining: number;
  status: 'active' | 'flagged' | 'completed' | 'disconnected';
  violations: number;
  lastActivity: string;
}

const ExamMonitor = () => {
  const [students] = useState<Student[]>([
    {
      id: 'FA21-BSE-024',
      name: 'Ahmad Ali',
      subject: 'MATH101',
      examStartTime: '09:00 AM',
      timeRemaining: 5400, // 90 minutes in seconds
      status: 'active',
      violations: 0,
      lastActivity: '2 seconds ago'
    },
    {
      id: 'SP22-BCS-045',
      name: 'Sarah Khan',
      subject: 'CS101',
      examStartTime: '09:15 AM',
      timeRemaining: 4800,
      status: 'flagged',
      violations: 3,
      lastActivity: '30 seconds ago'
    },
    {
      id: 'FA23-BME-012',
      name: 'Hassan Ahmed',
      subject: 'PHY101',
      examStartTime: '08:45 AM',
      timeRemaining: 6000,
      status: 'active',
      violations: 1,
      lastActivity: '5 seconds ago'
    },
    {
      id: 'SP21-BEE-089',
      name: 'Fatima Sheikh',
      subject: 'CHEM101',
      examStartTime: '09:30 AM',
      timeRemaining: 0,
      status: 'completed',
      violations: 0,
      lastActivity: '15 minutes ago'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getViolationColor = (violations: number) => {
    if (violations === 0) return 'text-green-600';
    if (violations <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {students.filter(s => s.status === 'flagged').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {students.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {students.reduce((sum, s) => sum + s.violations, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Live Exam Monitoring</CardTitle>
          <CardDescription>Monitor all active exam sessions in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="completed">Completed</option>
              <option value="disconnected">Disconnected</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.id}</p>
                    </div>
                    <Badge variant="outline">{student.subject}</Badge>
                    <Badge className={`${getStatusColor(student.status)} border-0`}>
                      {student.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium">Time Left</p>
                      <p className="text-muted-foreground">
                        {student.status === 'completed' ? 'Completed' : formatTime(student.timeRemaining)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Violations</p>
                      <p className={`font-bold ${getViolationColor(student.violations)}`}>
                        {student.violations}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">Last Activity</p>
                      <p className="text-muted-foreground">{student.lastActivity}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamMonitor;
