'use client';
import { useState, useEffect } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password: string) => {
    // If password is empty, don't show any strength
    if (!password) {
      setStrength('weak');
      setMessage("");
      return;
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

    // Determine strength based on score
    if (score < 3) {
      setStrength('weak');
      setMessage("Weak: Add more characters and mix types");
    } else if (score < 5) {
      setStrength('fair');
      setMessage("Fair: Consider adding more variety");
    } else if (score < 7) {
      setStrength('good');
      setMessage("Good: Your password is solid");
    } else {
      setStrength('strong');
      setMessage("Strong: Excellent password strength");
    }
  };

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  return (
    <div className="w-full space-y-1">
      <div className="password-strength-meter">
        <div className={`password-strength-${strength}`}></div>
      </div>
      <p className="text-xs text-gray-500">{message}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
