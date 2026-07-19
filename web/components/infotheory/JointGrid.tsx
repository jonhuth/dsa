"use client";

import { useState } from "react";
import { fmt, marginals, redistribute } from "@/lib/infotheory";

interface JointGridProps {
	/** Joint distribution P(X, Y) as rows (X) × cols (Y), summing to ~1. */
	joint: number[][];
	onChange: (joint: number[][]) => void;
	xLabels?: string[];
	yLabels?: string[];
}

/**
 * Editable joint-distribution heatmap with X/Y marginal bars. Click a cell to
 * select it, then use the slider to set its probability — the remaining mass
 * redistributes across the other cells so the table always sums to 1.
 */
export function JointGrid({ joint, onChange, xLabels, yLabels }: JointGridProps) {
	const rows = joint.length;
	const cols = joint[0]?.length ?? 0;
	const [sel, setSel] = useState<[number, number] | null>(null);

	const { px, py } = marginals(joint);
	const maxCell = Math.max(...joint.flat(), 1e-9);
	const maxMarg = Math.max(...px, ...py, 1e-9);

	const setCell = (i: number, j: number, p: number) => {
		const flat = joint.flat();
		const next = redistribute(flat, i * cols + j, p);
		const out: number[][] = [];
		for (let r = 0; r < rows; r++) out.push(next.slice(r * cols, r * cols + cols));
		onChange(out);
	};

	const cell = 52;
	const marg = 22;

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto">
				<div
					className="inline-grid gap-1"
					style={{ gridTemplateColumns: `auto ${marg}px repeat(${cols}, ${cell}px)` }}
				>
					{/* Header: corner + spacer + Y labels */}
					<div />
					<div />
					{Array.from({ length: cols }, (_, j) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed grid columns
						<div key={`yl-${j}`} className="text-center text-xs text-sky-400">
							{yLabels?.[j] ?? `y${j}`}
						</div>
					))}

					{/* P(Y) marginal bar row */}
					<div className="flex items-center justify-end pr-1 text-[10px] text-muted-foreground">
						P(Y)
					</div>
					<div />
					{py.map((v, j) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed grid columns
						<div key={`py-${j}`} className="flex h-5 items-end justify-center">
							<div
								className="w-full rounded-t bg-sky-500/70"
								style={{ height: `${((v / maxMarg) * 100).toFixed(4)}%` }}
								title={`P(Y=${yLabels?.[j] ?? j}) = ${fmt(v, 3)}`}
							/>
						</div>
					))}

					{/* Rows: X label + P(X) marginal + cells */}
					{Array.from({ length: rows }, (_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed grid rows
						<GridRow key={`row-${i}`}>
							<div className="flex items-center justify-end pr-1 text-xs text-emerald-400">
								{xLabels?.[i] ?? `x${i}`}
							</div>
							<div className="flex items-center">
								<div className="flex h-full w-full items-center">
									<div
										className="h-3 rounded-r bg-emerald-500/70"
										style={{ width: `${((px[i] / maxMarg) * 100).toFixed(4)}%` }}
										title={`P(X=${xLabels?.[i] ?? i}) = ${fmt(px[i], 3)}`}
									/>
								</div>
							</div>
							{Array.from({ length: cols }, (_, j) => {
								const p = joint[i][j];
								const isSel = sel?.[0] === i && sel?.[1] === j;
								return (
									<button
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed grid cells
										key={`c-${i}-${j}`}
										type="button"
										onClick={() => setSel([i, j])}
										className={`flex items-center justify-center rounded font-mono text-[11px] transition-all ${
											isSel ? "ring-2 ring-violet-400" : ""
										}`}
										style={{
											height: cell,
											backgroundColor: `color-mix(in oklab, var(--color-violet-500, #8b5cf6) ${Math.round(
												(p / maxCell) * 90 + 6,
											)}%, transparent)`,
										}}
										title={`P(${xLabels?.[i] ?? i}, ${yLabels?.[j] ?? j}) = ${fmt(p, 3)}`}
									>
										{fmt(p, 2)}
									</button>
								);
							})}
						</GridRow>
					))}
				</div>
			</div>

			{sel ? (
				<label className="block">
					<span className="mb-1 block text-xs text-muted-foreground">
						P({xLabels?.[sel[0]] ?? sel[0]}, {yLabels?.[sel[1]] ?? sel[1]}) ={" "}
						<span className="font-mono">{fmt(joint[sel[0]][sel[1]], 3)}</span>
					</span>
					<input
						type="range"
						min={0}
						max={950}
						value={Math.round(joint[sel[0]][sel[1]] * 1000)}
						onChange={(e) => setCell(sel[0], sel[1], Number(e.target.value) / 1000)}
						className="w-full accent-violet-500"
					/>
				</label>
			) : (
				<p className="text-xs text-muted-foreground">Click a cell to adjust its probability.</p>
			)}
		</div>
	);
}

// A "display: contents" wrapper so each logical row's children flow into the
// parent CSS grid.
function GridRow({ children }: { children: React.ReactNode }) {
	return <div style={{ display: "contents" }}>{children}</div>;
}
