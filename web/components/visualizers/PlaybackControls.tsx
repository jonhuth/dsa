"use client";

import { Pause, Play, SkipBack, SkipForward, StepBack, StepForward } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PlaybackControlsProps {
	currentStep: number;
	totalSteps: number;
	onStepChange: (step: number) => void;
	defaultSpeed?: number;
}

const SPEED_OPTIONS = [
	{ label: "0.5x", ms: 1000 },
	{ label: "1x", ms: 500 },
	{ label: "2x", ms: 250 },
	{ label: "3x", ms: 167 },
];

export function PlaybackControls({
	currentStep,
	totalSteps,
	onStepChange,
	defaultSpeed = 500,
}: PlaybackControlsProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(defaultSpeed);
	const [showShortcuts, setShowShortcuts] = useState(false);

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
				case "r": // R - Reset
				case "R":
					e.preventDefault();
					goToFirst();
					break;
				case "?":
					e.preventDefault();
					setShowShortcuts((s) => !s);
					break;
				case "Escape":
					setShowShortcuts(false);
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [togglePlay, goToFirst, goToPrevious, goToNext, goToLast]);

	return (
		<div className="space-y-3 sm:space-y-4 relative">
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
				<div className="flex gap-1">
					{SPEED_OPTIONS.map((opt) => (
						<button
							key={opt.label}
							type="button"
							onClick={() => setSpeed(opt.ms)}
							className={`px-2 py-1 text-xs rounded border transition-colors touch-manipulation ${
								speed === opt.ms
									? "bg-primary text-primary-foreground border-primary"
									: "border-border hover:bg-accent"
							}`}
							title={`${opt.label} speed`}
						>
							{opt.label}
						</button>
					))}
				</div>
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

			{/* Keyboard Hints + Help Button */}
			<div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
				<div className="hidden sm:flex items-center gap-4">
					<span>
						<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Space</kbd> Play/Pause
					</span>
					<span>
						<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">←</kbd>
						<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">→</kbd> Step
					</span>
					<span>
						<kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">R</kbd> Reset
					</span>
				</div>
				<button
					type="button"
					onClick={() => setShowShortcuts((s) => !s)}
					className="ml-1 w-5 h-5 rounded-full border border-border text-[10px] hover:bg-accent transition-colors flex items-center justify-center"
					title="Keyboard shortcuts (?)"
				>
					?
				</button>
			</div>

			{/* Shortcuts Modal */}
			{showShortcuts && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-card border border-border rounded-lg p-6 w-80 shadow-xl">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-semibold text-base">Keyboard Shortcuts</h3>
							<button
								type="button"
								onClick={() => setShowShortcuts(false)}
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Close"
							>
								x
							</button>
						</div>
						<div className="space-y-3 text-sm">
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Play / Pause</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Step forward</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">right arrow</kbd>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Step back</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">left arrow</kbd>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Jump to start</span>
								<span className="text-xs">
									<kbd className="px-2 py-1 bg-muted rounded">Shift</kbd>
									{" + "}
									<kbd className="px-2 py-1 bg-muted rounded">left arrow</kbd>
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Jump to end</span>
								<span className="text-xs">
									<kbd className="px-2 py-1 bg-muted rounded">Shift</kbd>
									{" + "}
									<kbd className="px-2 py-1 bg-muted rounded">right arrow</kbd>
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Reset to start</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-muted-foreground">Show shortcuts</span>
								<kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
							</div>
						</div>
						<button
							type="button"
							onClick={() => setShowShortcuts(false)}
							className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
						>
							Got it
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
