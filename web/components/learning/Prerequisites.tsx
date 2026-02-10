import Link from "next/link";
import type { AlgorithmMetadata } from "@/lib/types";

interface PrerequisitesProps {
  prerequisites: AlgorithmMetadata[];
  algorithmName: string;
}

export function Prerequisites({ prerequisites, algorithmName }: PrerequisitesProps) {
  if (!prerequisites || prerequisites.length === 0) {
    return (
      <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
        <p className="text-sm text-green-500">✓ No prerequisites - great starting point!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Prerequisites</h3>
      <p className="text-sm text-muted-foreground">
        We recommend understanding these concepts first:
      </p>
      <div className="space-y-2">
        {prerequisites.map((prereq) => (
          <Link
            key={prereq.id}
            href={prereq.path}
            className="block p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {prereq.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{prereq.description}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors ml-2">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
