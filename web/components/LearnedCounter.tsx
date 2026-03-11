"use client";

import { useEffect, useState } from "react";
import { getLearnedSlugs } from "@/hooks/useLearnedState";

interface Props {
	totalAlgorithms: number;
}

export function LearnedCounter({ totalAlgorithms }: Props) {
	const [learnedCount, setLearnedCount] = useState(0);

	useEffect(() => {
		setLearnedCount(getLearnedSlugs().size);

		// Re-read on storage changes (e.g. from another tab)
		const handleStorage = () => {
			setLearnedCount(getLearnedSlugs().size);
		};
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	return (
		<div className="text-center">
			<div className="text-2xl sm:text-3xl font-bold text-green-500">
				{learnedCount}/{totalAlgorithms}
			</div>
			<div className="text-xs sm:text-sm text-muted-foreground">Learned</div>
		</div>
	);
}
