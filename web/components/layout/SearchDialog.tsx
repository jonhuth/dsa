"use client";

import {
	Binary,
	Boxes,
	Calculator,
	GitBranch,
	Hash,
	Layers,
	Link2,
	Mountain,
	Search,
	Sigma,
	Target,
	TreePine,
	TrendingUp,
	Type,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import registry from "@/lib/registry";
import type { Category, ConceptCollection } from "@/lib/types";

const categoryIcons: Record<Category, React.ComponentType<{ className?: string }>> = {
	sorting: TrendingUp,
	searching: Binary,
	graphs: GitBranch,
	trees: TreePine,
	dynamic_programming: Calculator,
	data_structures: Boxes,
	strings: Type,
	heaps: Mountain,
	linked_lists: Link2,
	hash_tables: Hash,
	stacks_queues: Layers,
	problems: Target,
	mini_systems: Boxes,
};

const conceptCollectionIcons: Record<
	ConceptCollection,
	React.ComponentType<{ className?: string }>
> = {
	information_theory: Sigma,
};

// Difficulty badge colors. "Foundations" marks the concept exhibits, which
// aren't graded Easy/Medium/Hard — without its own case it would fall through
// to the red "Hard" styling.
const difficultyClass: Record<string, string> = {
	Easy: "bg-green-500/10 text-green-500",
	Medium: "bg-yellow-500/10 text-yellow-500",
	Foundations: "bg-violet-500/10 text-violet-400",
};

const HARD_CLASS = "bg-red-500/10 text-red-500";
const METRIC_CLASS = "bg-purple-500/10 text-purple-500";

interface Badge {
	label: string;
	className: string;
}

interface SearchEntry {
	id: string;
	name: string;
	description: string;
	path: string;
	/**
	 * Secondary match terms (category, description, complexity, tags). Kept out
	 * of `value` on purpose: cmdk scores `value` with a fuzzy subsequence match,
	 * so stuffing the description in there lets long entries out-rank an exact
	 * name hit ("kadane" used to surface Quick Sort first). `value` stays the
	 * short unique name; keywords are scored separately at a lower weight.
	 */
	keywords: string[];
	badges: Badge[];
}

interface SearchGroup {
	key: string;
	heading: string;
	Icon: React.ComponentType<{ className?: string }>;
	entries: SearchEntry[];
}

function titleCase(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Every searchable entry, derived from the registry — algorithms grouped by
 * category, then concept collections. Built once at module scope: the registry
 * is static data, so there is nothing to recompute per render.
 */
const searchGroups: SearchGroup[] = [
	...registry.categories.getActive().map((category): SearchGroup => {
		const entries = registry.algorithms.getByCategory(category.id).map((algo): SearchEntry => {
			const difficulty = titleCase(algo.difficulty);
			return {
				id: `algorithm:${algo.id}`,
				name: algo.name,
				description: algo.description,
				path: algo.path,
				keywords: [
					category.name,
					algo.description,
					algo.complexity.time.average,
					difficulty,
					...algo.tags,
				],
				badges: [
					{ label: algo.complexity.time.average, className: METRIC_CLASS },
					{ label: difficulty, className: difficultyClass[difficulty] ?? HARD_CLASS },
				],
			};
		});

		return {
			key: `category:${category.id}`,
			heading: category.name,
			Icon: categoryIcons[category.id] ?? Search,
			entries,
		};
	}),

	// Concepts have no Big-O and no difficulty grade. Rather than invent them,
	// they show their unit of measure (when they have one) plus a "Foundations"
	// badge in place of a difficulty.
	...registry.concepts.getAllCollections().map((collection): SearchGroup => {
		const entries = registry.concepts.getByCollection(collection.id).map((concept): SearchEntry => {
			const badges: Badge[] = [];
			if (concept.unit) badges.push({ label: concept.unit, className: METRIC_CLASS });
			badges.push({ label: "Foundations", className: difficultyClass.Foundations });

			return {
				id: `concept:${concept.id}`,
				name: concept.name,
				description: concept.description,
				path: concept.path,
				keywords: [
					collection.name,
					concept.description,
					...(concept.unit ? [concept.unit] : []),
					...concept.tags,
				],
				badges,
			};
		});

		return {
			key: `collection:${collection.id}`,
			heading: collection.name,
			Icon: conceptCollectionIcons[collection.id] ?? Search,
			entries,
		};
	}),
].filter((group) => group.entries.length > 0);

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Scorer for the palette.
 *
 * cmdk's default filter is a fuzzy *subsequence* match, which over 55 entries
 * with long descriptions matches almost everything: typing "kadane" scored 25
 * hits and buried "Kadane's Maximum Subarray" at position 15, because the
 * letters k-a-d-a-n-e appear scattered through other algorithms' prose.
 *
 * This filter matches on substrings instead, and ranks name hits above
 * description/tag hits so the obvious answer lands first.
 */
export function scoreEntry(value: string, search: string, keywords?: string[]): number {
	const query = search.trim().toLowerCase();
	if (!query) return 1;

	const name = value.toLowerCase();
	if (name === query) return 1;
	if (name.startsWith(query)) return 0.9;
	// Match at the start of any word ("sort" → "Radix Sort").
	if (new RegExp(`\\b${escapeRegExp(query)}`).test(name)) return 0.8;
	if (name.includes(query)) return 0.7;

	const haystack = (keywords ?? []).join(" ").toLowerCase();
	if (haystack.includes(query)) return 0.5;

	// Multi-word queries: every word has to land somewhere ("kl divergence").
	const words = query.split(/\s+/).filter(Boolean);
	if (words.length > 1) {
		const all = `${name} ${haystack}`;
		if (words.every((word) => all.includes(word))) return 0.3;
	}

	return 0;
}

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
	const router = useRouter();
	const [search, setSearch] = useState("");

	/**
	 * cmdk hides non-matching items but leaves the survivors in source order, so
	 * the auto-selected first row was not always the best match (typing "radix"
	 * landed on Counting Sort, which merely mentions radix in its description).
	 * Ordering the rendered list by the same score cmdk filters with puts the
	 * strongest hit — and its group — first.
	 */
	const orderedGroups = useMemo(() => {
		if (!search.trim()) return searchGroups;

		return searchGroups
			.map((group) => {
				const scored = group.entries.map((entry) => ({
					entry,
					score: scoreEntry(entry.name, search, entry.keywords),
				}));
				scored.sort((a, b) => b.score - a.score);
				return {
					group: { ...group, entries: scored.map((s) => s.entry) },
					best: scored.length > 0 ? scored[0].score : 0,
				};
			})
			.sort((a, b) => b.best - a.best)
			.map((g) => g.group);
	}, [search]);

	// Handle keyboard shortcut
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				// Closing via the shortcut should clear the query too, matching Esc.
				if (open) setSearch("");
				onOpenChange(!open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, onOpenChange]);

	const handleSelect = (path: string) => {
		onOpenChange(false);
		router.push(path);
	};

	// Start from a clean query each time the palette is opened.
	const handleOpenChange = (next: boolean) => {
		if (!next) setSearch("");
		onOpenChange(next);
	};

	return (
		<CommandDialog open={open} onOpenChange={handleOpenChange} filter={scoreEntry}>
			<CommandInput
				placeholder="Search algorithms & concepts..."
				value={search}
				onValueChange={setSearch}
			/>
			<CommandList className="max-h-[60vh] sm:max-h-[400px]">
				<CommandEmpty>No results found.</CommandEmpty>

				{orderedGroups.map(({ key, heading, Icon, entries }) => (
					<CommandGroup key={key} heading={heading}>
						{entries.map((entry) => (
							<CommandItem
								key={entry.id}
								value={entry.name}
								keywords={entry.keywords}
								onSelect={() => handleSelect(entry.path)}
								className="flex items-start gap-2 sm:gap-3 py-3 px-2 sm:px-3"
							>
								<div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
									<Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
								</div>
								<div className="flex-1 min-w-0 space-y-1">
									<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
										<span className="text-sm font-medium">{entry.name}</span>
										{entry.badges.map((badge) => (
											<span
												key={badge.label}
												className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded ${badge.className}`}
											>
												{badge.label}
											</span>
										))}
									</div>
									<p className="text-xs text-muted-foreground line-clamp-2 sm:line-clamp-1">
										{entry.description}
									</p>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				))}
			</CommandList>
		</CommandDialog>
	);
}
