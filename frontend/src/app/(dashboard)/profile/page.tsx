"use client";

import { Mail, AtSign, Shield } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { USER_TYPE_LABELS } from "@/lib/constants";

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar name={user.full_name} size="lg" />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-gray-900">
              {user.full_name}
            </h2>
            <Badge>{USER_TYPE_LABELS[user.user_type]}</Badge>
          </div>
        </div>
      </Card>

      {/* Account details */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Account Details
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <AtSign className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Mail className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Shield className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-gray-500">Account Type</p>
              <p className="font-medium text-gray-900">
                {USER_TYPE_LABELS[user.user_type]}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Supervisor info for supervised students */}
      {user.supervisor && (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Supervised By
          </h3>
          <div className="flex items-center gap-3">
            <Avatar name={user.supervisor.full_name} size="sm" />
            <div>
              <p className="font-medium text-gray-900">
                {user.supervisor.full_name}
              </p>
              <p className="text-sm text-gray-500">{user.supervisor.email}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Dependants info for parents */}
      {user.user_type === "parent" && user.dependants && user.dependants.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            My Children ({user.dependants.length})
          </h3>
          <div className="space-y-3">
            {user.dependants.map((child) => (
              <div key={child.id} className="flex items-center gap-3">
                <Avatar name={child.full_name} size="sm" />
                <div>
                  <p className="font-medium text-gray-900">
                    {child.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{child.email}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
