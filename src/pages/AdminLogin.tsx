
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication - In real app, this would be an API call
    setTimeout(() => {
      if (adminId === "admin" && password === "examcontroller123") {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminId', adminId);
        toast({
          title: "Login Successful",
          description: "Welcome to ExamController Admin Panel",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-background to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">ExamController</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Access the administrative dashboard
          </p>
        </div>

        <Card className="shadow-lg border-red-100">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Administrator Access</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the exam management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Admin ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="Enter admin username"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Demo Credentials</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Admin ID:</strong> admin</p>
                <p><strong>Password:</strong> examcontroller123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Contact system administrator or{" "}
            <Link to="/" className="text-primary hover:underline">
              return to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
