import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOPIC_GRADIENTS, TOPIC_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/lib/constants";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const gradient = course.colour
    ? [course.colour, course.colour]
    : TOPIC_GRADIENTS[course.topic] || TOPIC_GRADIENTS.other;
  const topicLabel = TOPIC_LABELS[course.topic] || "Other";
  const diffLabel = DIFFICULTY_LABELS[course.difficulty] || course.difficulty;
  const diffColor = DIFFICULTY_COLORS[course.difficulty] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <Link href={`/courses/${course.id}`}>
      <Card hover className="overflow-hidden">
        {/* Gradient cover */}
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-white/30" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{topicLabel}</Badge>
            <Badge bg={diffColor.bg} text={diffColor.text}>
              {diffLabel}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {course.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 border-t border-gray-50">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.estimated_hours}h
            </span>
            {course.tags.length > 0 && (
              <span className="truncate text-gray-400">
                {course.tags.slice(0, 2).join(", ")}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
