"use client";

import { BookOpen, Sparkles, Brain } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">Mentova</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl font-bold leading-tight">
            Your learning,
            <br />
            reimagined.
          </h1>
          <p className="text-lg text-indigo-100 max-w-md">
            Join thousands of students using AI to master new subjects faster
            and more effectively.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-indigo-100">
                Create courses on any topic instantly
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Brain className="h-4 w-4" />
              </div>
              <span className="text-indigo-100">
                Track progress with smart analytics
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-200">
          &copy; 2026 Mentova. Built for HackTheEast.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Mentova</span>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
