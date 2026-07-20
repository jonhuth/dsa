// Concept metadata registry
//
// Concepts are interactive explainers (currently the /information-theory
// exhibits). They are intentionally a separate collection from ALGORITHMS:
// they carry no Big-O and no difficulty grade, and the homepage "Algorithms"
// stat must keep counting algorithms only.

import type { ConceptCollection, ConceptCollectionMetadata, ConceptMetadata } from "./types";

export const CONCEPT_COLLECTIONS: Record<ConceptCollection, ConceptCollectionMetadata> = {
	information_theory: {
		id: "information_theory",
		name: "Information Theory",
		description:
			"Surprise measured in bits — entropy, cross-entropy, KL divergence, mutual information and the laws that follow from them.",
		icon: "📊",
		path: "/information-theory",
		conceptCount: 0, // Computed dynamically by getConceptCollection()
	},
};

export const CONCEPTS: Record<string, ConceptMetadata> = {
	entropy: {
		id: "entropy",
		name: "Shannon Entropy",
		collection: "information_theory",
		tags: ["entropy", "information", "bits", "surprise", "shannon", "compression"],
		description: "Surprise measured in bits — drag a distribution and watch H change",
		unit: "bits",
		path: "/information-theory/entropy",
	},
	"cross-entropy": {
		id: "cross-entropy",
		name: "Cross-Entropy & KL Divergence",
		collection: "information_theory",
		tags: ["cross-entropy", "kl divergence", "relative entropy", "loss", "information"],
		description: "The cost of believing the wrong distribution, and the gap it opens",
		unit: "bits",
		path: "/information-theory/cross-entropy",
	},
	"mutual-information": {
		id: "mutual-information",
		name: "Mutual Information",
		collection: "information_theory",
		tags: ["mutual information", "dependence", "correlation", "joint", "information"],
		description: "How much knowing one variable tells you about another",
		unit: "bits",
		path: "/information-theory/mutual-information",
	},
	"max-entropy": {
		id: "max-entropy",
		name: "Maximum Entropy",
		collection: "information_theory",
		tags: ["maximum entropy", "maxent", "priors", "constraints", "inference"],
		description: "The least-committal distribution consistent with what you know",
		unit: "bits",
		path: "/information-theory/max-entropy",
	},
	kolmogorov: {
		id: "kolmogorov",
		name: "Kolmogorov Complexity",
		collection: "information_theory",
		tags: ["kolmogorov", "complexity", "compression", "randomness", "incomputable"],
		description: "The shortest program that reproduces a string",
		unit: "incomputable",
		path: "/information-theory/kolmogorov",
	},
};

/**
 * Get concept by ID
 */
export function getConcept(id: string): ConceptMetadata | undefined {
	return CONCEPTS[id];
}

/**
 * Get all concepts
 */
export function getAllConcepts(): ConceptMetadata[] {
	return Object.values(CONCEPTS);
}

/**
 * Get concepts belonging to a collection
 */
export function getConceptsByCollection(collection: string): ConceptMetadata[] {
	return getAllConcepts().filter((concept) => concept.collection === collection);
}

/**
 * Get a concept collection with its computed concept count
 */
export function getConceptCollection(id: ConceptCollection): ConceptCollectionMetadata {
	return {
		...CONCEPT_COLLECTIONS[id],
		conceptCount: getConceptsByCollection(id).length,
	};
}

/**
 * Get all concept collections with computed concept counts
 */
export function getAllConceptCollections(): ConceptCollectionMetadata[] {
	return Object.values(CONCEPT_COLLECTIONS).map((c) => getConceptCollection(c.id));
}

/**
 * Search concepts by query (name, description, tags)
 */
export function searchConcepts(query: string): ConceptMetadata[] {
	const lowerQuery = query.toLowerCase();
	return getAllConcepts().filter(
		(concept) =>
			concept.name.toLowerCase().includes(lowerQuery) ||
			concept.description.toLowerCase().includes(lowerQuery) ||
			concept.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
	);
}
