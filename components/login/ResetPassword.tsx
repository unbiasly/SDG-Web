"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import Link from "next/link";

const ResetPassword = ({
    token,
    email,
}: {
    token: string | null;
    email: string | null;
}) => {
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

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password requirements
        if (!validatePassword(password)) {
            toast.error(
                "Password too short \n Password must be at least 8 characters long."
            );
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            toast.error(
                "Passwords don't match\nYour password and confirmation password must match."
            );
            return;
        }

        // Validate token and email
        if (!token || !email) {
            toast.error(
                "Invalid token or email\nPlease provide a valid token and email."
            );
            return;
        }

        setIsLoading(true);

        try {
            // Make API call to reset password
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, email, newPassword: password }),
            });

            const data = await response.json();

            if (data.message === "Password reset successfully") {
                setIsSuccess(true);
                toast.success(
                    "Password reset successful\nYour password has been reset successfully."
                );
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                }, 2000);
            } else {
                toast.error(data.message || "Failed to reset password");
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error(
                "An error occurred\nUnable to reset password. Please try again later."
            );
            console.error(error);
        } finally {
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-6 sm:py-16 w-full px-4 sm:px-0">
                <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                    <div className="rounded-full p-2 sm:p-3 inline-flex">
                        <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12 text-accent" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Password Reset Successful
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
                        Your password has been updated successfully. You can now
                        login with your new credentials.
                    </p>
                    <Button
                        className="mt-2 sm:mt-4 bg-accent hover:bg-accent/80 text-white transition-all py-2 sm:py-6 h-auto text-sm sm:text-base px-4 sm:px-6"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs sm:max-w-sm space-y-4 sm:space-y-6 px-2 sm:px-0"
        >
            <div className="space-y-1 sm:space-y-2 text-center">
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
                    Reset Password
                </h1>
                <p className="text-sm sm:text-base text-black">
                    Create your new password
                </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                    <label htmlFor="password" className="text-sm sm:text-base">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-10 py-4 sm:py-6 rounded-lg border border-gray-500 bg-white text-sm sm:text-base"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    <PasswordStrengthMeter password={password} />
                </div>

                <div className="space-y-1 sm:space-y-2">
                    <label
                        htmlFor="confirm-password"
                        className="text-sm sm:text-base"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`px-10 py-4 sm:py-6 rounded-lg border border-gray-500 bg-white text-sm sm:text-base ${
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
                                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs sm:text-sm text-red-500">
                            Passwords don't match
                        </p>
                    )}
                </div>
            </div>

            <Button
                type="submit"
                className="w-full rounded-full bg-accent hover:bg-[#1A2530] text-white transition-all shadow-sm py-2 sm:py-6 h-auto text-sm sm:text-base"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Resetting Password...
                    </div>
                ) : (
                    "Reset Password"
                )}
            </Button>
        </form>
    );
};

export default ResetPassword;
