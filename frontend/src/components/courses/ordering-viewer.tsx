"use client";

import { useState, useMemo } from "react";
import { clsx } from "clsx";
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OrderingData } from "@/lib/types";

interface OrderingViewerProps {
  data: OrderingData;
  onComplete?: () => void;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function OrderingViewer({ data, onComplete }: OrderingViewerProps) {
  const initial = useMemo(() => shuffle(data.items), [data.items]);
  const [currentOrder, setCurrentOrder] = useState<string[]>(initial);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const moveItem = (fromIdx: number, direction: "up" | "down") => {
    const toIdx = direction === "up" ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= currentOrder.length) return;
    const next = [...currentOrder];
    [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
    setCurrentOrder(next);
  };

  const checkOrder = () => {
    const res = currentOrder.map((item, idx) => item === data.items[idx]);
    setResults(res);
    setChecked(true);
    if (res.every(Boolean) && onComplete) {
      setTimeout(onComplete, 600);
    }
  };

  const reset = () => {
    setCurrentOrder(shuffle(data.items));
    setChecked(false);
    setResults([]);
  };

  const allCorrect = checked && results.every(Boolean);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Badge bg="bg-orange-100" text="text-orange-700">
          <ArrowUpDown className="h-3 w-3 mr-1 inline" />
          Ordering
        </Badge>
        <span className="text-sm text-gray-500">{data.instruction}</span>
      </div>

      {allCorrect ? (
        <div className="text-center space-y-4 py-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Perfect order!</p>
          <Button variant="secondary" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {currentOrder.map((item, idx) => (
              <div
                key={`${item}-${idx}`}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                  checked
                    ? results[idx]
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                    : "bg-white border-gray-200",
                )}
              >
                <span
                  className={clsx(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                    checked
                      ? results[idx]
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                      : "bg-gray-100 text-gray-600",
                  )}
                >
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm text-gray-800">{item}</span>
                {checked && !results[idx] && (
                  <span className="text-xs text-red-500">
                    → #{data.items.indexOf(item) + 1}
                  </span>
                )}
                {!checked && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveItem(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, "down")}
                      disabled={idx === currentOrder.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            {checked ? (
              <Button variant="secondary" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            ) : (
              <Button onClick={checkOrder}>Check Order</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
