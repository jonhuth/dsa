// Core types for the DSA Visualizer platform

export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "sorting"
  | "searching"
  | "graphs"
  | "trees"
  | "dynamic_programming"
  | "data_structures"
  | "strings"
  | "heaps"
  | "linked_lists"
  | "hash_tables"
  | "stacks_queues"
  | "problems"
  | "mini_systems";

export interface ComplexityAnalysis {
  time: {
    best: string;
    average: string;
    worst: string;
  };
  space: string;
  explanation: string;
}

export interface EdgeCase {
  name: string;
  description: string;
  input: unknown;
  expected?: unknown;
}

export interface SampleInput {
  name: string;
  description: string;
  value: unknown;
}

export interface AlgorithmMetadata {
  id: string; // URL-friendly slug (e.g., 'bubble-sort')
  name: string; // Display name (e.g., 'Bubble Sort')
  category: Category;
  difficulty: Difficulty;

  // Tags for search and linking
  tags: string[];

  // Complexity analysis
  complexity: ComplexityAnalysis;

  // Learning content
  description: string; // Brief description (1-2 sentences)
  howItWorks?: string; // Step-by-step explanation
  keyInsights?: string[]; // "Aha" moments
  edgeCases?: EdgeCase[]; // Pitfalls and boundary conditions
  whenToUse?: string[]; // Real-world applications
  interviewTips?: string[]; // Interview-specific advice

  // Relationships
  prerequisites?: string[]; // Algorithm IDs to learn first
  relatedAlgorithms?: string[]; // Similar or contrasting
  usesDataStructures?: string[]; // DS this algorithm relies on

  // Visualization config
  visualizationType: "array" | "graph" | "tree" | "grid" | "composite";
  defaultInputs?: unknown[];
  sampleInputs?: SampleInput[];

  // Paths
  path: string; // URL path (e.g., '/algorithms/sorting/bubble-sort')
  pythonModule?: string; // Python module path (e.g., 'sorting.bubble_sort')
}

export interface DataStructureMetadata {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  complexity: ComplexityAnalysis;
  description: string;
  operations?: string[]; // e.g., ['insert', 'delete', 'search']
  usedBy?: string[]; // Algorithm IDs that use this DS
  path: string;
}

export interface ProblemMetadata {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  constraints?: string[];
  examples?: Array<{ input: unknown; output: unknown; explanation?: string }>;
  solutionAlgorithms?: string[]; // Algorithm IDs used in solution
  path: string;
}

export interface MiniSystemMetadata {
  id: string;
  name: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  components: {
    algorithms: string[]; // Algorithm IDs
    dataStructures: string[]; // DS IDs
  };
  path: string;
}

export interface CategoryMetadata {
  id: Category;
  name: string;
  description: string;
  icon?: string;
  algorithmCount: number;
}
