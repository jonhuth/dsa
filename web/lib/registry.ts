// Central content registry for algorithms, data structures, problems, and mini-systems

import {
	getAlgorithm,
	getAlgorithmsByCategory,
	getAlgorithmsByDifficulty,
	getAlgorithmsByTag,
	getAllAlgorithms,
	searchAlgorithms,
} from "./algorithms";
import { getActiveCategories, getAllCategories, getCategory } from "./categories";
import {
	getAllConceptCollections,
	getAllConcepts,
	getConcept,
	getConceptCollection,
	getConceptsByCollection,
	searchConcepts,
} from "./concepts";
import type { DataStructureMetadata, MiniSystemMetadata, ProblemMetadata } from "./types";

/**
 * Central registry for all DSA content
 *
 * This is the single source of truth for accessing algorithms, data structures,
 * problems, and mini-systems throughout the application.
 */
export const registry = {
	// Algorithms
	algorithms: {
		get: getAlgorithm,
		getAll: getAllAlgorithms,
		getByCategory: getAlgorithmsByCategory,
		getByDifficulty: getAlgorithmsByDifficulty,
		getByTag: getAlgorithmsByTag,
		search: searchAlgorithms,
	},

	// Concepts — interactive explainers (Information Theory). Deliberately kept
	// out of `algorithms` so the homepage algorithm count stays accurate and the
	// algorithm-shaped UI is not handed Big-O-less entries.
	concepts: {
		get: getConcept,
		getAll: getAllConcepts,
		getByCollection: getConceptsByCollection,
		search: searchConcepts,
		getCollection: getConceptCollection,
		getAllCollections: getAllConceptCollections,
	},

	// Categories
	categories: {
		get: getCategory,
		getAll: getAllCategories,
		getActive: getActiveCategories,
	},

	// Data Structures (future)
	dataStructures: {
		get: (_id: string): DataStructureMetadata | undefined => undefined,
		getAll: (): DataStructureMetadata[] => [],
	},

	// Problems (future)
	problems: {
		get: (_id: string): ProblemMetadata | undefined => undefined,
		getAll: (): ProblemMetadata[] => [],
	},

	// Mini Systems (future)
	miniSystems: {
		get: (_id: string): MiniSystemMetadata | undefined => undefined,
		getAll: (): MiniSystemMetadata[] => [],
	},
};

// Export type for the registry
export type Registry = typeof registry;

// Export default
export default registry;
