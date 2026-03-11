"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Tracks whether the user has marked an algorithm as learned.
 * Persists to localStorage under the key `dsa_learned_<slug>`.
 */
export function useLearnedState(algorithmSlug: string): [boolean, () => void] {
	const key = `dsa_learned_${algorithmSlug}`;
	const [isLearned, setIsLearned] = useState(false);

	useEffect(() => {
		try {
			setIsLearned(localStorage.getItem(key) === "true");
		} catch {
			// localStorage may be unavailable (SSR / private browsing)
		}
	}, [key]);

	const toggleLearned = useCallback(() => {
		setIsLearned((prev) => {
			const next = !prev;
			try {
				if (next) {
					localStorage.setItem(key, "true");
				} else {
					localStorage.removeItem(key);
				}
			} catch {
				// ignore
			}
			return next;
		});
	}, [key]);

	return [isLearned, toggleLearned];
}

/**
 * Returns the set of learned algorithm slugs from localStorage.
 * Safe to call during SSR (returns empty set).
 */
export function getLearnedSlugs(): Set<string> {
	if (typeof window === "undefined") return new Set();
	const learned = new Set<string>();
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (k?.startsWith("dsa_learned_") && localStorage.getItem(k) === "true") {
				learned.add(k.replace("dsa_learned_", ""));
			}
		}
	} catch {
		// ignore
	}
	return learned;
}
