interface WhenToUseProps {
  useCases: string[];
  algorithmName: string;
}

export function WhenToUse({ useCases, algorithmName }: WhenToUseProps) {
  if (!useCases || useCases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">When to Use</h3>
      <div className="space-y-2">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
          >
            <span className="text-primary mt-0.5">✓</span>
            <p className="text-sm leading-relaxed">{useCase}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
