import { describe, expect, it } from "vitest";
import { ALGORITHMS } from "./algorithms";
import { registry } from "./registry";

// These tests are deliberately structural: they assert the registry's contract
// (lookups resolve, filters are consistent, ids are well-formed) rather than
// pinning specific content, so adding an algorithm does not break the suite.

const allAlgorithms = registry.algorithms.getAll();
const sampleId = Object.keys(ALGORITHMS)[0];

describe("registry.algorithms", () => {
	it("exposes every algorithm in the ALGORITHMS map", () => {
		expect(allAlgorithms.length).toBe(Object.keys(ALGORITHMS).length);
		expect(allAlgorithms.length).toBeGreaterThan(0);
	});

	it("resolves each algorithm by its own id, and the id round-trips", () => {
		for (const [id, algo] of Object.entries(ALGORITHMS)) {
			const found = registry.algorithms.get(id);
			expect(found).toBeDefined();
			expect(found?.id).toBe(algo.id);
			// the map key and the record's own id must agree
			expect(algo.id).toBe(id);
		}
	});

	it("returns undefined for an unknown id rather than throwing", () => {
		expect(registry.algorithms.get("definitely-not-an-algorithm")).toBeUndefined();
		expect(registry.algorithms.get("")).toBeUndefined();
	});

	it("partitions every algorithm into exactly one category bucket", () => {
		const categories = new Set(allAlgorithms.map((a) => a.category));
		let total = 0;
		for (const category of categories) {
			const bucket = registry.algorithms.getByCategory(category);
			expect(bucket.length).toBeGreaterThan(0);
			for (const algo of bucket) expect(algo.category).toBe(category);
			total += bucket.length;
		}
		expect(total).toBe(allAlgorithms.length);
	});

	it("partitions every algorithm into exactly one difficulty bucket", () => {
		const difficulties = new Set(allAlgorithms.map((a) => a.difficulty));
		let total = 0;
		for (const difficulty of difficulties) {
			const bucket = registry.algorithms.getByDifficulty(difficulty);
			for (const algo of bucket) expect(algo.difficulty).toBe(difficulty);
			total += bucket.length;
		}
		expect(total).toBe(allAlgorithms.length);
	});

	it("returns an empty array for unknown categories, difficulties and tags", () => {
		expect(registry.algorithms.getByCategory("not-a-category")).toEqual([]);
		expect(registry.algorithms.getByDifficulty("impossible")).toEqual([]);
		expect(registry.algorithms.getByTag("not-a-tag")).toEqual([]);
	});

	it("finds an algorithm by each of its own tags", () => {
		const withTags = allAlgorithms.find((a) => a.tags.length > 0);
		expect(withTags).toBeDefined();
		if (!withTags) return;
		for (const tag of withTags.tags) {
			expect(registry.algorithms.getByTag(tag).map((a) => a.id)).toContain(withTags.id);
		}
	});

	describe("search", () => {
		it("finds an algorithm by its exact name", () => {
			const target = ALGORITHMS[sampleId];
			expect(registry.algorithms.search(target.name).map((a) => a.id)).toContain(target.id);
		});

		it("is case-insensitive", () => {
			const target = ALGORITHMS[sampleId];
			const lower = registry.algorithms.search(target.name.toLowerCase());
			const upper = registry.algorithms.search(target.name.toUpperCase());
			expect(lower.map((a) => a.id)).toEqual(upper.map((a) => a.id));
			expect(lower.length).toBeGreaterThan(0);
		});

		it("matches on category as well as name", () => {
			const target = ALGORITHMS[sampleId];
			expect(registry.algorithms.search(target.category).map((a) => a.id)).toContain(target.id);
		});

		it("returns everything for the empty query and nothing for gibberish", () => {
			expect(registry.algorithms.search("")).toHaveLength(allAlgorithms.length);
			expect(registry.algorithms.search("zzzzzqqqqqxxxxx")).toEqual([]);
		});
	});
});

describe("registry.categories", () => {
	it("computes an algorithm count that matches the category bucket", () => {
		for (const category of registry.categories.getAll()) {
			expect(category.algorithmCount).toBe(registry.algorithms.getByCategory(category.id).length);
		}
	});

	it("gives every category an id, name, description and icon", () => {
		const categories = registry.categories.getAll();
		expect(categories.length).toBeGreaterThan(0);
		for (const category of categories) {
			expect(category.id).toBeTruthy();
			expect(category.name).toBeTruthy();
			expect(category.description).toBeTruthy();
			expect(category.icon).toBeTruthy();
		}
	});

	it("getActive returns exactly the non-empty categories", () => {
		const active = registry.categories.getActive();
		const expected = registry.categories.getAll().filter((c) => c.algorithmCount > 0);
		expect(active.map((c) => c.id)).toEqual(expected.map((c) => c.id));
		for (const category of active) expect(category.algorithmCount).toBeGreaterThan(0);
	});

	it("getActive is a subset of getAll", () => {
		const allIds = new Set(registry.categories.getAll().map((c) => c.id));
		for (const category of registry.categories.getActive())
			expect(allIds.has(category.id)).toBe(true);
	});

	it("resolves a single category consistently with getAll", () => {
		const first = registry.categories.getAll()[0];
		expect(registry.categories.get(first.id)).toEqual(first);
	});
});

describe("registry — unimplemented sections", () => {
	// These are declared-but-empty placeholders. Pinning them means the day
	// someone implements one, they get a failing test reminding them to
	// replace these expectations with real ones.
	it("dataStructures, problems and miniSystems are still empty stubs", () => {
		for (const section of [registry.dataStructures, registry.problems, registry.miniSystems]) {
			expect(section.getAll()).toEqual([]);
			expect(section.get("anything")).toBeUndefined();
		}
	});
});
