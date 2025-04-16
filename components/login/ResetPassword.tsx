'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import Link from "next/link";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address."
      });
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Your password and confirmation password must match."
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      toast.success("Password reset successful", {
        description: "Your password has been reset successfully."
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="form-card bg-[#F0EBFF] text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-[#E6F7E9] p-3 inline-flex">
            <CheckCircle2 className="h-12 w-12 text-[#34C759]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful</h2>
          <p className="text-gray-600 max-w-xs mx-auto">
            Your password has been updated successfully. You can now login with your new credentials.
          </p>
          <Button 
            className="mt-4 bg-accent hover:bg-accent/80 text-white transition-all"
            onClick={() => window.location.href = "/login"}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-card space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
        <p className="text-gray-500">Enter your email and create a new password</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-white"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pl-10 bg-white pr-10 ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500">Passwords don't match</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-[#1A2530] text-white transition-all shadow-sm"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            Resetting Password...
          </div>
        ) : (
          "Reset Password"
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Remember your password?{" "}
          <Link href="/login" className="text-accent hover:text-[#2980B9] font-bold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default ResetPassword;
