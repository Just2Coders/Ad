import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

type AuthMode = "login" | "register";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
        setShowVerificationAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-[400px] p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          {showVerificationAlert && mode === "register" && (
            <Alert>
              <AlertDescription>
                Please check your email for a verification link to complete your
                registration.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>{mode === "login" ? "Login" : "Create Account"}</>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setShowVerificationAlert(false);
              }}
              disabled={isLoading}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
