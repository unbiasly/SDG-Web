import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

const ForgotPasswordForm = ({ onBackToSignIn }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    try {
      const response = await fetch('/login/api/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
    //   setIsSubmitted(true);
      
      if (!data.success) {
        toast.error(data.message || "Failed to send recovery email");
        return;
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error("An error occurred. Please try again later.");
      return;
    }

    toast.success("Recovery email sent!");
    // Handle password reset logic here
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Recovery email resent!");
    // Handle resend logic here
  };

  return (
    <div className="w-full max-w-md space-y-6 p-2">
      <div className="flex items-center gap-2 mb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBackToSignIn}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>

      <div className="text-left mb-4">
        <p className="text-muted-foreground">
          Sign In to get the best experience of our app.
          <br />
          Never miss update turn on notifications.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <p className="text-sm text-muted-foreground">
          A recovery email will be sent to you, follow the steps to reset your password to gain access to your account.
        </p>

        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-[#19486A] text-xl  py-6 hover:scale-105 transition-all duration-300 cursor-pointer rounded-full text-white"
        >
          Continue
        </Button>
      </div>

      {/* {isSubmitted && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Not received any mail?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-blue-300 hover:underline font-semibold"
            >
              Resend again
            </button>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default ForgotPasswordForm;
