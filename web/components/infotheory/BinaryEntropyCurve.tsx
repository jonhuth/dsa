"use client";

import { type PointerEvent as ReactPointerEvent, useCallback, useMemo, useRef } from "react";
import { binaryEntropy, fmt } from "@/lib/infotheory";

// Plot padding (module-level so it's a stable reference in hook deps).
const PAD = { l: 44, r: 16, t: 16, b: 40 };

interface BinaryEntropyCurveProps {
	/** Current p (probability of the "heads" outcome), in [0,1]. */
	p: number;
	onChange?: (p: number) => void;
	width?: number;
	height?: number;
}

/**
 * The binary entropy function H₂(p) = −p·log₂p − (1−p)·log₂(1−p): a concave
 * arch peaking at 1 bit when p = 0.5 and vanishing at the certain outcomes
 * p = 0 and p = 1. Drag along the curve to move p.
 */
export function BinaryEntropyCurve({
	p,
	onChange,
	width = 520,
	height = 300,
}: BinaryEntropyCurveProps) {
	const svgRef = useRef<SVGSVGElement>(null);
	const dragging = useRef(false);
	const plotW = width - PAD.l - PAD.r;
	const plotH = height - PAD.t - PAD.b;

	const x = useCallback((prob: number) => PAD.l + prob * plotW, [plotW]);
	const y = useCallback((h: number) => PAD.t + (1 - h) * plotH, [plotH]);

	const path = useMemo(() => {
		const pts: string[] = [];
		const steps = 200;
		for (let i = 0; i <= steps; i++) {
			const prob = i / steps;
			pts.push(`${i === 0 ? "M" : "L"}${x(prob).toFixed(2)},${y(binaryEntropy(prob)).toFixed(2)}`);
		}
		return pts.join(" ");
	}, [x, y]);

	const h = binaryEntropy(p);

	const applyFromPointer = useCallback(
		(clientX: number) => {
			const svg = svgRef.current;
			if (!svg || !onChange) return;
			const rect = svg.getBoundingClientRect();
			const frac = (clientX - rect.left - PAD.l) / plotW;
			onChange(Math.max(0, Math.min(1, frac)));
		},
		[onChange, plotW],
	);

	const onDown = (e: ReactPointerEvent) => {
		dragging.current = true;
		(e.target as Element).setPointerCapture?.(e.pointerId);
		applyFromPointer(e.clientX);
	};
	const onMove = (e: ReactPointerEvent) => {
		if (dragging.current) applyFromPointer(e.clientX);
	};
	const onUp = () => {
		dragging.current = false;
	};

	return (
		<svg
			ref={svgRef}
			viewBox={`0 0 ${width} ${height}`}
			className="w-full touch-none select-none"
			role="img"
			aria-label={`Binary entropy curve, p = ${fmt(p)}, H = ${fmt(h)} bits`}
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onUp}
			onPointerCancel={onUp}
		>
			<title>Binary entropy function</title>
			{/* Axes */}
			<line
				x1={PAD.l}
				y1={y(0)}
				x2={PAD.l + plotW}
				y2={y(0)}
				className="stroke-border"
				strokeWidth={1}
			/>
			<line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={y(0)} className="stroke-border" strokeWidth={1} />
			{/* Gridlines at H = 0.5 and 1 */}
			{[0.5, 1].map((g) => (
				<g key={g}>
					<line
						x1={PAD.l}
						y1={y(g)}
						x2={PAD.l + plotW}
						y2={y(g)}
						className="stroke-border"
						strokeWidth={1}
						strokeDasharray="3 4"
						opacity={0.5}
					/>
					<text
						x={PAD.l - 8}
						y={y(g) + 4}
						textAnchor="end"
						className="fill-muted-foreground text-[10px]"
					>
						{g}
					</text>
				</g>
			))}
			{/* x-axis ticks */}
			{[0, 0.5, 1].map((t) => (
				<text
					key={t}
					x={x(t)}
					y={y(0) + 20}
					textAnchor="middle"
					className="fill-muted-foreground text-[10px]"
				>
					{t}
				</text>
			))}
			<text
				x={PAD.l + plotW / 2}
				y={height - 4}
				textAnchor="middle"
				className="fill-muted-foreground text-xs"
			>
				p (probability of outcome A)
			</text>
			{/* Curve */}
			<path d={path} className="fill-none stroke-violet-500" strokeWidth={2.5} />
			{/* Guide + point */}
			<line
				x1={x(p)}
				y1={y(0)}
				x2={x(p)}
				y2={y(h)}
				className="stroke-violet-400"
				strokeWidth={1}
				strokeDasharray="2 3"
			/>
			<line
				x1={PAD.l}
				y1={y(h)}
				x2={x(p)}
				y2={y(h)}
				className="stroke-violet-400"
				strokeWidth={1}
				strokeDasharray="2 3"
			/>
			<circle
				cx={x(p)}
				cy={y(h)}
				r={7}
				className="fill-violet-500 stroke-background"
				strokeWidth={2}
			/>
		</svg>
	);
}
