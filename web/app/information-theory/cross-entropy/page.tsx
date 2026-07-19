"use client";

import Link from "next/link";
import { useState } from "react";
import { EntropyBars } from "@/components/infotheory/EntropyBars";
import { crossEntropy, entropy, fmt, klDivergence, logBase } from "@/lib/infotheory";

const LABELS = ["A", "B", "C", "D"];

export default function CrossEntropyPage() {
	// p = the "true" distribution (reality); q = the model's beliefs.
	const [p, setP] = useState<number[]>([0.5, 0.25, 0.15, 0.1]);
	const [q, setQ] = useState<number[]>([0.25, 0.25, 0.25, 0.25]);

	const hP = entropy(p);
	const ce = crossEntropy(p, q);
	const kl = klDivergence(p, q);
	const klReverse = klDivergence(q, p);
	const ceInfinite = !Number.isFinite(ce);

	// Stacked-bar scale: cross-entropy = entropy floor + KL surcharge.
	const scaleMax = Math.max(ceInfinite ? hP * 1.6 : ce, hP, 0.001);
	const hPct = (hP / scaleMax) * 100;
	const klPct = ceInfinite ? 100 - hPct : (kl / scaleMax) * 100;

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-10">
				<div className="text-sm text-muted-foreground">
					<Link href="/information-theory" className="hover:underline">
						Information Theory
					</Link>{" "}
					/ Cross-Entropy &amp; KL Divergence
				</div>

				<header className="space-y-3">
					<h1 className="text-3xl font-bold sm:text-4xl">Cross-Entropy &amp; KL Divergence</h1>
					<p className="max-w-3xl text-muted-foreground">
						What does it cost to describe reality <strong>p</strong> using a code built for your
						<strong> model q</strong>? Cross-entropy answers that in bits. The gap between it and
						the true entropy — the wasted bits — is the Kullback–Leibler divergence, and it is
						exactly what you minimize when you train a classifier.
					</p>
					<div className="grid gap-2 rounded-lg border border-border bg-card/60 p-4 font-mono text-sm sm:grid-cols-3">
						<div>H(p, q) = −Σ p·log₂ q</div>
						<div>D(p‖q) = Σ p·log₂(p/q)</div>
						<div className="text-violet-400">H(p, q) = H(p) + D(p‖q)</div>
					</div>
				</header>

				{/* ── Editors ────────────────────────────────────────── */}
				<section className="grid gap-6 lg:grid-cols-2">
					<div className="space-y-3 rounded-xl border border-border p-6">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-emerald-400">p — reality (truth)</h2>
							<PresetButtons onPick={setP} />
						</div>
						<EntropyBars
							probs={p}
							onChange={setP}
							labels={LABELS}
							colors={["bg-emerald-500"]}
							height={170}
						/>
					</div>
					<div className="space-y-3 rounded-xl border border-border p-6">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold text-sky-400">q — model (beliefs)</h2>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setQ([...p])}
									className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
								>
									q ← p
								</button>
								<PresetButtons onPick={setQ} />
							</div>
						</div>
						<EntropyBars
							probs={q}
							onChange={setQ}
							labels={LABELS}
							colors={["bg-sky-500"]}
							height={170}
						/>
					</div>
				</section>

				{/* ── Decomposition ──────────────────────────────────── */}
				<section className="space-y-5 rounded-xl border border-border p-6">
					<h2 className="text-xl font-semibold">
						Cross-entropy = irreducible entropy + KL surcharge
					</h2>

					<div className="grid gap-4 sm:grid-cols-3">
						<Stat
							label="Entropy H(p)"
							value={`${fmt(hP, 3)}`}
							unit="bits"
							className="text-emerald-400"
						/>
						<Stat
							label="Cross-entropy H(p, q)"
							value={fmt(ce, 3)}
							unit="bits"
							className="text-violet-400"
						/>
						<Stat
							label="KL divergence D(p‖q)"
							value={fmt(kl, 3)}
							unit="bits"
							className="text-amber-400"
						/>
					</div>

					<div>
						<div className="flex h-10 w-full overflow-hidden rounded-lg bg-muted text-xs font-medium">
							<div
								className="flex items-center justify-center bg-emerald-500/80 transition-[width] duration-150"
								style={{ width: `${hPct.toFixed(4)}%` }}
								title="H(p): bits you could never avoid"
							>
								{hPct > 12 ? "H(p)" : ""}
							</div>
							<div
								className="flex items-center justify-center bg-amber-500/80 transition-[width] duration-150"
								style={{ width: `${Math.max(klPct, 0).toFixed(4)}%` }}
								title="KL(p‖q): wasted bits from the wrong model"
							>
								{klPct > 12 ? (ceInfinite ? "∞" : "KL") : ""}
							</div>
						</div>
						<div className="mt-2 flex justify-between text-xs text-muted-foreground">
							<span>
								<span className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500 align-middle" />
								H(p) — irreducible, set by reality
							</span>
							<span>
								<span className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-500 align-middle" />
								KL — wasted by q ≠ p
							</span>
						</div>
					</div>

					{ceInfinite ? (
						<p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
							Cross-entropy is <strong>infinite</strong>: your model q assigns zero probability to
							an outcome that reality p says can happen. A single confident-and-wrong prediction
							makes the expected code length blow up — which is why models predict with softmax
							(never exactly 0) and why label smoothing exists.
						</p>
					) : (
						<p className="text-sm text-muted-foreground">
							Set <span className="font-mono">q ← p</span> and the amber band vanishes: KL = 0 and
							cross-entropy bottoms out at H(p). You can never beat the entropy floor — the best
							possible model still pays H(p) bits. Everything above it is self-inflicted.
						</p>
					)}
				</section>

				{/* ── Asymmetry ──────────────────────────────────────── */}
				<section className="space-y-3 rounded-xl border border-border p-6">
					<h2 className="text-xl font-semibold">KL is not a distance — it is directional</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						<Stat
							label="D(p ‖ q) — code for q, data from p"
							value={fmt(kl, 3)}
							unit="bits"
							className="text-amber-400"
						/>
						<Stat
							label="D(q ‖ p) — the other direction"
							value={fmt(klReverse, 3)}
							unit="bits"
							className="text-amber-400"
						/>
					</div>
					<p className="text-sm text-muted-foreground">
						In general D(p‖q) ≠ D(q‖p), so KL is <strong>not a metric</strong> (no symmetry, no
						triangle inequality). The asymmetry has teeth in ML: minimizing D(p‖q) (forward KL, as
						in maximum likelihood) is <em>mean-seeking</em> and spreads q to cover all of p&rsquo;s
						support; minimizing D(q‖p) (reverse KL, as in variational inference) is{" "}
						<em>mode-seeking</em> and lets q collapse onto a single mode.
					</p>
				</section>

				{/* ── Coding interpretation ──────────────────────────── */}
				<section className="space-y-4 rounded-xl border border-border p-6">
					<h2 className="text-xl font-semibold">The coding view: per-symbol bill</h2>
					<p className="text-sm text-muted-foreground">
						A code optimized for q spends −log₂ q(x) bits on symbol x. Reality draws symbols with
						frequency p(x), so you pay the p-weighted average — the cross-entropy. Optimal would
						have been −log₂ p(x) bits each.
					</p>
					<div className="overflow-x-auto">
						<table className="w-full min-w-[440px] text-sm">
							<thead className="text-muted-foreground">
								<tr className="border-b border-border text-left">
									<th className="py-2 font-medium">outcome</th>
									<th className="py-2 text-right font-medium">p(x)</th>
									<th className="py-2 text-right font-medium">q(x)</th>
									<th className="py-2 text-right font-medium">optimal −log₂p</th>
									<th className="py-2 text-right font-medium">paid −log₂q</th>
									<th className="py-2 text-right font-medium">waste</th>
								</tr>
							</thead>
							<tbody className="font-mono">
								{p.map((pi, i) => {
									const optimal = pi > 0 ? -logBase(pi, 2) : 0;
									const paid = q[i] > 0 ? -logBase(q[i], 2) : Number.POSITIVE_INFINITY;
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed categorical outcomes
										<tr key={i} className="border-b border-border/50">
											<td className="py-1.5">{LABELS[i]}</td>
											<td className="py-1.5 text-right">{fmt(pi, 2)}</td>
											<td className="py-1.5 text-right">{fmt(q[i], 2)}</td>
											<td className="py-1.5 text-right text-emerald-400">{fmt(optimal, 2)}</td>
											<td className="py-1.5 text-right text-sky-400">{fmt(paid, 2)}</td>
											<td className="py-1.5 text-right text-amber-400">
												{Number.isFinite(paid) ? fmt(paid - optimal, 2) : "∞"}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>

				{/* ── ML deduction ───────────────────────────────────── */}
				<section className="space-y-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-6">
					<h2 className="text-xl font-semibold">Why every classifier minimizes cross-entropy</h2>
					<p className="text-sm text-muted-foreground">
						With p fixed by the data, H(p) is a constant, so{" "}
						<span className="font-mono">argmin_q H(p, q) = argmin_q D(p‖q)</span>. Minimizing
						cross-entropy loss <em>is</em> pulling the model q toward the data distribution p — and
						it is identical to <strong>maximum-likelihood estimation</strong>: the cross-entropy of
						the empirical distribution against q equals the average negative log-likelihood. Softmax
						turns logits into a q; cross-entropy scores it; gradients shrink the KL.
					</p>
				</section>

				{/* ── Laws ───────────────────────────────────────────── */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Laws &amp; Deductions</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{CE_LAWS.map((law) => (
							<div key={law.title} className="rounded-xl border border-border bg-card/40 p-5">
								<h3 className="font-semibold text-violet-400">{law.title}</h3>
								<p className="mt-1 font-mono text-xs text-muted-foreground">{law.formula}</p>
								<p className="mt-2 text-sm">{law.body}</p>
							</div>
						))}
					</div>
				</section>

				<div className="flex justify-between border-t border-border pt-6 text-sm">
					<Link href="/information-theory/entropy" className="text-violet-400 hover:underline">
						← Shannon Entropy
					</Link>
					<Link href="/information-theory" className="text-violet-400 hover:underline">
						Information Theory
					</Link>
				</div>
			</div>
		</div>
	);
}

function PresetButtons({ onPick }: { onPick: (d: number[]) => void }) {
	const presets: Record<string, number[]> = {
		unif: [0.25, 0.25, 0.25, 0.25],
		peak: [0.7, 0.15, 0.1, 0.05],
		"0": [0.34, 0.33, 0.33, 0.0],
	};
	return (
		<div className="flex gap-1">
			{Object.entries(presets).map(([name, d]) => (
				<button
					key={name}
					type="button"
					onClick={() => onPick([...d])}
					className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
				>
					{name === "unif" ? "uniform" : name === "peak" ? "peaked" : "has 0"}
				</button>
			))}
		</div>
	);
}

function Stat({
	label,
	value,
	unit,
	className,
}: {
	label: string;
	value: string;
	unit?: string;
	className?: string;
}) {
	return (
		<div className="rounded-lg border border-border bg-card/60 p-4 text-center">
			<div className={`font-mono text-2xl font-bold ${className ?? ""}`}>
				{value}
				{unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
			</div>
			<div className="mt-1 text-xs text-muted-foreground">{label}</div>
		</div>
	);
}

const CE_LAWS: Array<{ title: string; formula: string; body: string }> = [
	{
		title: "Gibbs' inequality",
		formula: "H(p, q) ≥ H(p),  equality ⇔ q = p",
		body: "No model beats the true distribution's own code. Cross-entropy bottoms out at the entropy floor exactly when your beliefs match reality.",
	},
	{
		title: "KL non-negativity",
		formula: "D(p‖q) ≥ 0,  = 0 ⇔ p = q",
		body: "The wasted-bits surcharge is never negative — a direct corollary of Gibbs. This is the workhorse inequality behind ELBOs, rate–distortion, and PAC-Bayes bounds.",
	},
	{
		title: "The decomposition",
		formula: "H(p, q) = H(p) + D(p‖q)",
		body: "Cross-entropy splits cleanly into what reality demands (entropy) and what your model wastes (KL). Training moves only the second term.",
	},
	{
		title: "Asymmetry",
		formula: "D(p‖q) ≠ D(q‖p)  (in general)",
		body: "KL is a divergence, not a distance. Forward KL is mean-seeking (covers all modes); reverse KL is mode-seeking (collapses to one) — a real modeling choice.",
	},
	{
		title: "Cross-entropy = negative log-likelihood",
		formula: "argmin_q H(p̂, q) = MLE",
		body: "Fitting a model by minimizing cross-entropy against the empirical distribution is exactly maximum-likelihood estimation — the bridge from information theory to statistics.",
	},
	{
		title: "Zero-avoidance",
		formula: "q(x) = 0 < p(x) ⇒ H(p, q) = ∞",
		body: "A confident wrong prediction is infinitely costly. Softmax outputs, Laplace smoothing, and label smoothing all exist to keep q strictly positive.",
	},
];
