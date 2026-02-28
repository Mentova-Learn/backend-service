"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Users } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { ApiError, getErrorMessage } from "@/lib/api";
import { ROUTES } from "@/lib/constants";

type AccountType = "student" | "parent";


export function RegisterForm() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const [userType, setUserType] = useState<AccountType>("student");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({
        username,
        full_name: fullName,
        email,
        password,
        user_type: userType,
      });
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(getErrorMessage(err.code));
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
        <p className="text-sm text-gray-500">
          Start your personalised learning experience
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Account type toggle */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          I am a...
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUserType("student")}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
              userType === "student"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300",
            )}
          >
            <GraduationCap className="h-6 w-6" />
            <span className="text-sm font-medium">Student</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType("parent")}
            className={clsx(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
              userType === "parent"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300",
            )}
          >
            <Users className="h-6 w-6" />
            <span className="text-sm font-medium">Parent</span>
          </button>
        </div>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <Input
        label="Username"
        placeholder="johndoe"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
