"use client";

interface ArrayVisualizerProps {
  values: number[];
  highlights?: Array<{
    indices: number[];
    color: string;
  }>;
  height?: number;
}

export function ArrayVisualizer({ values, highlights = [], height = 256 }: ArrayVisualizerProps) {
  const colorClasses = {
    default: "bg-gray-500",
    comparing: "bg-yellow-500",
    swapped: "bg-green-500",
    sorted: "bg-purple-500",
    active: "bg-blue-500",
    visited: "bg-gray-600",
  };

  return (
    <div className="flex items-end justify-center gap-2" style={{ height: `${height}px` }}>
      {values.map((value, idx) => {
        const highlight = highlights.find((h) => h.indices?.includes(idx));
        const color = highlight?.color || "default";

        return (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              className={`w-12 ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300`}
              style={{ height: `${value * 20}px` }}
            />
            <div className="text-xs">{value}</div>
          </div>
        );
      })}
    </div>
  );
}
