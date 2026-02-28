import type { ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:80";

export class ApiError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
  ) {
    super(code);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new ApiError(json.data as unknown as string, res.status);
  }

  return json.data;
}

export const ERROR_MESSAGES: Record<string, string> = {
  "auth.invalid_credentials": "Invalid email or password",
  "auth.email_taken": "This email is already registered",
  "auth.username_taken": "This username is already taken",
  "auth.user_not_found": "User not found",
  "auth.not_parent": "Only parent accounts can add children",
  "auth.invalid_token": "Session expired, please log in again",
  "courses.generation_failed": "Course generation failed. Please try again.",
  "courses.invalid_ai_response": "AI returned an invalid response. Please try again.",
  "courses.not_found": "Course not found.",
  "courses.not_owner": "You don't have access to this course.",
  "courses.explanation_failed": "Could not generate explanation.",
  "courses.insufficient_progress": "Complete at least 50% of the course to unlock this feature.",
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "Something went wrong. Please try again.";
}
