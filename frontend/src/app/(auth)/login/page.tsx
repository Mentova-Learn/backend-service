"use client";

import { BookOpen, Sparkles, Brain } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-800 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-12 h-40 w-40 rounded-full bg-white/5" />

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
            Learn smarter,
            <br />
            not harder.
          </h1>
          <p className="text-lg text-violet-100 max-w-md">
            AI-powered courses that adapt to your pace, style, and goals. From
            primary school through university.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-violet-100">
                Personalised AI-generated courses
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Brain className="h-4 w-4" />
              </div>
              <span className="text-violet-100">
                Adaptive quizzes and flashcards
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-violet-200">
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

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
