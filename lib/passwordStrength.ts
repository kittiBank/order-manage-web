export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  percentage: number;
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  if (!password) {
    return {
      score: 0,
      label: 'Too weak',
      color: 'text-gray-400',
      bgColor: 'bg-gray-200',
      percentage: 0,
    };
  }

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; // Has both upper and lowercase
  if (/\d/.test(password)) score++; // Has numbers
  if (/[^a-zA-Z0-9]/.test(password)) score++; // Has special characters

  // Map score to strength levels
  const strengths: { [key: number]: Omit<PasswordStrength, 'score'> } = {
    0: { label: 'Too weak', color: 'text-gray-400', bgColor: 'bg-gray-200', percentage: 0 },
    1: { label: 'Weak', color: 'text-red-500', bgColor: 'bg-red-500', percentage: 25 },
    2: { label: 'Fair', color: 'text-orange-500', bgColor: 'bg-orange-500', percentage: 50 },
    3: { label: 'Good', color: 'text-yellow-500', bgColor: 'bg-yellow-500', percentage: 75 },
    4: { label: 'Strong', color: 'text-green-500', bgColor: 'bg-green-500', percentage: 100 },
    5: { label: 'Very Strong', color: 'text-green-600', bgColor: 'bg-green-600', percentage: 100 },
  };

  const strength = strengths[Math.min(score, 5)];
  
  return {
    score,
    ...strength,
  };
};

export const getPasswordRequirements = (password: string) => {
  return [
    {
      met: password.length >= 8,
      text: 'At least 8 characters',
    },
    {
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
      text: 'Upper and lowercase letters',
    },
    {
      met: /\d/.test(password),
      text: 'At least one number',
    },
    {
      met: /[^a-zA-Z0-9]/.test(password),
      text: 'At least one special character',
    },
  ];
};
