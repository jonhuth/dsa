"use client";

import { Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PlaybackControlsProps {
	currentStep: number;
	totalSteps: number;
	onStepChange: (step: number) => void;
	defaultSpeed?: number;
}

export function PlaybackControls({
	currentStep,
	totalSteps,
	onStepChange,
	defaultSpeed = 500,
}: PlaybackControlsProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(defaultSpeed);

	const isAtStart = currentStep === 0;
	const isAtEnd = currentStep === totalSteps - 1;

	const goToFirst = useCallback(() => {
		onStepChange(0);
		setIsPlaying(false);
	}, [onStepChange]);

	const goToPrevious = useCallback(() => {
		onStepChange(Math.max(0, currentStep - 1));
	}, [currentStep, onStepChange]);

	const goToNext = useCallback(() => {
		if (currentStep < totalSteps - 1) {
			onStepChange(currentStep + 1);
		} else {
			setIsPlaying(false);
		}
	}, [currentStep, totalSteps, onStepChange]);

	const goToLast = useCallback(() => {
		onStepChange(totalSteps - 1);
		setIsPlaying(false);
	}, [totalSteps, onStepChange]);

	const togglePlay = useCallback(() => {
		if (isAtEnd) {
			onStepChange(0);
		}
		setIsPlaying((p) => !p);
	}, [isAtEnd, onStepChange]);

	// Auto-play effect
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			goToNext();
		}, speed);

		return () => clearInterval(interval);
	}, [isPlaying, speed, goToNext]);

	// Stop playing when reaching end
	useEffect(() => {
		if (isAtEnd && isPlaying) {
			setIsPlaying(false);
		}
	}, [isAtEnd, isPlaying]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ignore if typing in input
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			switch (e.key) {
				case " ": // Space - Play/Pause
					e.preventDefault();
					togglePlay();
					break;
				case "ArrowLeft": // Left - Previous
					e.preventDefault();
					if (e.shiftKey) {
						goToFirst();
					} else {
						goToPrevious();
					}
					break;
				case "ArrowRight": // Right - Next
					e.preventDefault();
					if (e.shiftKey) {
						goToLast();
					} else {
						goToNext();
					}
					break;
				case "ArrowUp": // Up - Speed up
					e.preventDefault();
					setSpeed((s) => Math.max(100, s - 100));
					break;
				case "ArrowDown": // Down - Slow down
					e.preventDefault();
					setSpeed((s) => Math.min(2000, s + 100));
					break;
				case "r": // R - Reset
				case "R":
					e.preventDefault();
					goToFirst();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [togglePlay, goToFirst, goToPrevious, goToNext, goToLast]);

	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Main Controls */}
			<div className="flex items-center justify-center gap-1 sm:gap-2">
				<button
					type="button"
					onClick={goToFirst}
					disabled={isAtStart}
					className="p-2 sm:p-2 border border-border rounded hover:bg-accent disabled:opacity-50 transition-colors touch-manipulation"
					title="First (Shift+←)"
				>
					<SkipBack className="h-4 w-4 sm:h-4 sm:w-4" />
				</button>
				<button
					type="button"
					onClick={goToPrevious}
					disabled={isAtStart}
					className="p-2 sm:p-2 border border-border rounded hover:bg-accent disabled:opacity-50 transition-colors touch-manipulation"
					title="Previous (←)"
				>
					<StepBack className="h-4 w-4 sm:h-4 sm:w-4" />
				</button>
				<button
					type="button"
					onClick={togglePlay}
					className="p-3 sm:p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors touch-manipulation"
					title={isPlaying ? "Pause (Space)" : "Play (Space)"}
				>
					{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
				</button>
				<button
					type="button"
					onClick={goToNext}
					disabled={isAtEnd}
					className="p-2 sm:p-2 border border-border rounded hover:bg-accent disabled:opacity-50 transition-colors touch-manipulation"
					title="Next (→)"
				>
					<StepForward className="h-4 w-4 sm:h-4 sm:w-4" />
				</button>
				<button
					type="button"
					onClick={goToLast}
					disabled={isAtEnd}
					className="p-2 sm:p-2 border border-border rounded hover:bg-accent disabled:opacity-50 transition-colors touch-manipulation"
					title="Last (Shift+→)"
				>
					<SkipForward className="h-4 w-4 sm:h-4 sm:w-4" />
				</button>
			</div>

			{/* Speed Control */}
			<div className="flex items-center justify-center gap-2 sm:gap-3">
				<span className="text-xs text-muted-foreground">Speed:</span>
				<input
					type="range"
					min="100"
					max="2000"
					step="100"
					value={2100 - speed}
					onChange={(e) => setSpeed(2100 - Number(e.target.value))}
					className="w-24 sm:w-32 h-2 bg-border rounded-lg appearance-none cursor-pointer touch-manipulation"
					title="Speed (↑/↓)"
				/>
				<span className="text-xs text-muted-foreground w-12 sm:w-16">{speed}ms</span>
			</div>

			{/* Progress */}
			<div className="flex items-center justify-center gap-2">
				<div className="w-32 sm:w-48 h-1 bg-border rounded-full overflow-hidden">
					<div
						className="h-full bg-primary transition-all duration-200"
						style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
					/>
				</div>
				<span className="text-xs text-muted-foreground">
					{currentStep + 1} / {totalSteps}
				</span>
			</div>

			{/* Keyboard Hints - Hidden on mobile */}
			<div className="hidden sm:flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
				<span>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Space</kbd> Play/Pause
				</span>
				<span>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">←</kbd>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">→</kbd> Step
				</span>
				<span>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↓</kbd> Speed
				</span>
				<span>
					<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">R</kbd> Reset
				</span>
			</div>
		</div>
	);
}
