"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setIsLoading(false);

      toast(data.message || "Failed to send recovery email");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again later.");
      return;
    }

    toast.success(isResend ? "Recovery email resent!" : "Recovery email sent!");
    // Handle password reset logic here
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    handleSubmit(e as unknown as React.FormEvent);
    setIsResend(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm px-4 sm:px-0 space-y-4 sm:space-y-6"
    >
      <div className="space-y-1 sm:space-y-2 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Forgot Password
        </h1>
        <p className="text-sm sm:text-base text-black px-2">
          Sign In to get the best experience of our app. Never miss update turn
          on notifications.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 rounded-lg border border-gray-400 bg-white py-4 sm:py-6 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#a5a5a5] font-medium">
          A recovery email will be sent to you, follow to steps to reset your
          password to gain access to your account.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full rounded-full bg-accent hover:bg-[#1A2530] text-white transition-all shadow-sm py-2 text-sm sm:text-base md:text-xl h-auto"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 border-2 border-white border-t-transparent rounded-full"/>
            Sending Link...
          </div>
        ) : (
          "Continue"
        )}
      </Button>

      <div className="text-center pt-2 sm:pt-0">
        <p className="text-xs sm:text-sm text-gray-500">
          Not received any mail?{" "}
          <button
            onClick={handleResend}
            className="text-gray-500 hover:text-accent font-medium cursor-pointer hover:underline px-1 py-2"
          >
            Resend again
          </button>
        </p>
      </div>
    </form>
  );
};

export default ForgotPassword;
