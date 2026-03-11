"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Syncs the current step index with the URL hash (#step=N).
 * Returns [currentStep, setCurrentStep] - a drop-in replacement for useState(0).
 */
export function useStepHash(totalSteps: number): [number, (step: number) => void] {
	const [currentStep, setCurrentStepState] = useState(0);

	// On mount, read initial step from hash
	useEffect(() => {
		const readHash = () => {
			const match = window.location.hash.match(/#step=(\d+)/);
			if (match) {
				const parsed = Number.parseInt(match[1], 10);
				if (!Number.isNaN(parsed) && parsed >= 0) {
					// Will be clamped once totalSteps is known
					setCurrentStepState(parsed);
				}
			}
		};
		readHash();
	}, []);

	// Clamp step when totalSteps changes (e.g. after algorithm run)
	useEffect(() => {
		if (totalSteps > 0) {
			setCurrentStepState((s) => Math.min(s, totalSteps - 1));
		}
	}, [totalSteps]);

	// Write hash whenever step changes
	const setCurrentStep = useCallback((step: number) => {
		setCurrentStepState(step);
		const url = new URL(window.location.href);
		url.hash = `step=${step}`;
		window.history.replaceState(null, "", url.toString());
	}, []);

	return [currentStep, setCurrentStep];
}
