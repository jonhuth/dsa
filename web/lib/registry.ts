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
import type {
	AlgorithmMetadata,
	DataStructureMetadata,
	MiniSystemMetadata,
	ProblemMetadata,
} from "./types";

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
