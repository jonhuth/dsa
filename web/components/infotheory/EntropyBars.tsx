"use client";

import { type PointerEvent as ReactPointerEvent, useCallback, useRef } from "react";
import { fmt } from "@/lib/infotheory";

interface EntropyBarsProps {
	/** Probability distribution (each in [0,1], summing to ~1). */
	probs: number[];
	/** Called with a new, renormalized distribution when a bar is dragged. */
	onChange?: (probs: number[]) => void;
	labels?: string[];
	/** Tailwind bg-* class per bar; cycles if shorter than probs. */
	colors?: string[];
	height?: number;
	editable?: boolean;
	/** Optional per-bar overlay value (e.g. surprise in bits). */
	annotate?: (index: number) => string;
}

const DEFAULT_COLORS = [
	"bg-violet-500",
	"bg-sky-500",
	"bg-emerald-500",
	"bg-amber-500",
	"bg-rose-500",
	"bg-cyan-500",
	"bg-fuchsia-500",
	"bg-lime-500",
];

/**
 * Set outcome `index` to probability `p`, redistributing the remaining
 * 1 − p across the other outcomes in proportion to their current mass
 * (uniformly if they are all zero). Keeps the distribution summing to 1 so
 * bar heights are exactly the probabilities.
 */
function setProbability(probs: number[], index: number, p: number): number[] {
	const clamped = Math.max(0, Math.min(0.999, p));
	const remaining = 1 - clamped;
	const othersSum = probs.reduce((acc, v, i) => (i === index ? acc : acc + v), 0);
	return probs.map((v, i) => {
		if (i === index) return clamped;
		if (othersSum <= 0) return remaining / (probs.length - 1);
		return (v / othersSum) * remaining;
	});
}

export function EntropyBars({
	probs,
	onChange,
	labels,
	colors = DEFAULT_COLORS,
	height = 200,
	editable = true,
	annotate,
}: EntropyBarsProps) {
	const trackRef = useRef<HTMLDivElement>(null);
	const dragging = useRef<number | null>(null);

	const applyFromPointer = useCallback(
		(index: number, clientY: number) => {
			const track = trackRef.current;
			if (!track || !onChange) return;
			const rect = track.getBoundingClientRect();
			const frac = 1 - (clientY - rect.top) / rect.height;
			onChange(setProbability(probs, index, frac));
		},
		[probs, onChange],
	);

	const handleDown = (index: number) => (e: ReactPointerEvent) => {
		if (!editable) return;
		dragging.current = index;
		(e.target as HTMLElement).setPointerCapture?.(e.pointerId);
		applyFromPointer(index, e.clientY);
	};

	const handleMove = (index: number) => (e: ReactPointerEvent) => {
		if (dragging.current !== index) return;
		applyFromPointer(index, e.clientY);
	};

	const handleUp = () => {
		dragging.current = null;
	};

	return (
		<div className="w-full">
			<div
				ref={trackRef}
				className="flex items-end justify-center gap-2 sm:gap-3"
				style={{ height }}
			>
				{probs.map((p, i) => {
					const color = colors[i % colors.length];
					const label = labels?.[i] ?? String(i);
					const pct = Math.max(0, Math.min(100, p * 100));
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length categorical outcomes
							key={i}
							className="flex h-full flex-1 flex-col items-center justify-end"
							style={{ maxWidth: 72 }}
						>
							{annotate && (
								<span className="mb-1 text-[10px] font-mono text-muted-foreground">
									{annotate(i)}
								</span>
							)}
							<div className="relative flex h-full w-full items-end justify-center">
								<button
									type="button"
									aria-label={`Set probability of outcome ${label}`}
									onPointerDown={handleDown(i)}
									onPointerMove={handleMove(i)}
									onPointerUp={handleUp}
									onPointerCancel={handleUp}
									disabled={!editable}
									className={`w-full rounded-t-md ${color} transition-[height] duration-75 ${
										editable ? "cursor-ns-resize hover:brightness-110" : ""
									}`}
									style={{ height: `${Math.max(pct, 1.5)}%`, touchAction: "none" }}
								/>
							</div>
							<span className="mt-2 font-mono text-xs tabular-nums">{fmt(p * 100, 1)}%</span>
							<span className="text-[11px] text-muted-foreground">{label}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
