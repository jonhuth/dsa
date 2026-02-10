// Cross-content relationships for "Related Algorithms" and bidirectional linking

import type { AlgorithmMetadata } from "./types";
import { getAlgorithm, getAllAlgorithms } from "./algorithms";

/**
 * Get algorithms that are related to the given algorithm
 */
export function getRelatedAlgorithms(algorithmId: string): AlgorithmMetadata[] {
  const algo = getAlgorithm(algorithmId);
  if (!algo || !algo.relatedAlgorithms) return [];

  return algo.relatedAlgorithms
    .map((id) => getAlgorithm(id))
    .filter((a): a is AlgorithmMetadata => a !== undefined);
}

/**
 * Get algorithms that list this algorithm as a prerequisite (inverse relationship)
 */
export function getAlgorithmsThatRequire(algorithmId: string): AlgorithmMetadata[] {
  return getAllAlgorithms().filter(
    (algo) => algo.prerequisites && algo.prerequisites.includes(algorithmId)
  );
}

/**
 * Get prerequisite algorithms
 */
export function getPrerequisites(algorithmId: string): AlgorithmMetadata[] {
  const algo = getAlgorithm(algorithmId);
  if (!algo || !algo.prerequisites) return [];

  return algo.prerequisites
    .map((id) => getAlgorithm(id))
    .filter((a): a is AlgorithmMetadata => a !== undefined);
}

/**
 * Get algorithms that use the same data structures
 */
export function getAlgorithmsUsingSameDataStructures(algorithmId: string): AlgorithmMetadata[] {
  const algo = getAlgorithm(algorithmId);
  if (!algo || !algo.usesDataStructures) return [];

  const dataStructures = new Set(algo.usesDataStructures);

  return getAllAlgorithms().filter(
    (other) =>
      other.id !== algorithmId &&
      other.usesDataStructures &&
      other.usesDataStructures.some((ds) => dataStructures.has(ds))
  );
}

/**
 * Get algorithms in the same category
 */
export function getAlgorithmsInSameCategory(algorithmId: string): AlgorithmMetadata[] {
  const algo = getAlgorithm(algorithmId);
  if (!algo) return [];

  return getAllAlgorithms().filter(
    (other) => other.category === algo.category && other.id !== algorithmId
  );
}

/**
 * Get algorithms with similar tags
 */
export function getAlgorithmsWithSimilarTags(
  algorithmId: string,
  minSharedTags = 2
): AlgorithmMetadata[] {
  const algo = getAlgorithm(algorithmId);
  if (!algo) return [];

  const tags = new Set(algo.tags);

  return getAllAlgorithms()
    .filter((other) => {
      if (other.id === algorithmId) return false;
      const sharedTags = other.tags.filter((tag) => tags.has(tag)).length;
      return sharedTags >= minSharedTags;
    })
    .sort((a, b) => {
      // Sort by number of shared tags (descending)
      const aShared = a.tags.filter((tag) => tags.has(tag)).length;
      const bShared = b.tags.filter((tag) => tags.has(tag)).length;
      return bShared - aShared;
    });
}

/**
 * Get all related content for an algorithm (comprehensive)
 */
export function getAllRelatedContent(algorithmId: string): {
  prerequisites: AlgorithmMetadata[];
  related: AlgorithmMetadata[];
  requiredBy: AlgorithmMetadata[];
  sameCategory: AlgorithmMetadata[];
  similarTags: AlgorithmMetadata[];
  sameDataStructures: AlgorithmMetadata[];
} {
  return {
    prerequisites: getPrerequisites(algorithmId),
    related: getRelatedAlgorithms(algorithmId),
    requiredBy: getAlgorithmsThatRequire(algorithmId),
    sameCategory: getAlgorithmsInSameCategory(algorithmId),
    similarTags: getAlgorithmsWithSimilarTags(algorithmId),
    sameDataStructures: getAlgorithmsUsingSameDataStructures(algorithmId),
  };
}
