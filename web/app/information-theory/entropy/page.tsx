"use client";

import Link from "next/link";
import { useState } from "react";
import { BinaryEntropyCurve } from "@/components/infotheory/BinaryEntropyCurve";
import { EntropyBars } from "@/components/infotheory/EntropyBars";
import { entropy, fmt, maxEntropy, perplexity, surprise } from "@/lib/infotheory";

const OUTCOME_LABELS = ["A", "B", "C", "D", "E", "F"];

const PRESETS: Record<string, number[]> = {
	Uniform: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
	Skewed: [0.5, 0.25, 0.125, 0.0625, 0.03125, 0.03125],
	"Near-certain": [0.95, 0.01, 0.01, 0.01, 0.01, 0.01],
	Bimodal: [0.4, 0.1, 0.0, 0.0, 0.1, 0.4],
};

export default function EntropyPage() {
	const [surpriseP, setSurpriseP] = useState(0.125);
	const [binP, setBinP] = useState(0.5);
	const [dist, setDist] = useState<number[]>(PRESETS.Skewed);

	const n = dist.length;
	const h = entropy(dist);
	const hMax = maxEntropy(n);
	const ppl = perplexity(dist);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-10">
				{/* Breadcrumb */}
				<div className="text-sm text-muted-foreground">
					<Link href="/information-theory" className="hover:underline">
						Information Theory
					</Link>{" "}
					/ Shannon Entropy
				</div>

				<header className="space-y-3">
					<h1 className="text-3xl font-bold sm:text-4xl">Shannon Entropy</h1>
					<p className="max-w-3xl text-muted-foreground">
						Entropy measures <em>average surprise</em> — the expected number of bits needed to pin
						down the outcome of a random source. It is the floor no lossless code can beat and the
						currency almost every other information-theoretic quantity is priced in.
					</p>
					<div className="rounded-lg border border-border bg-card/60 p-4 font-mono text-sm">
						H(X) = − Σ<sub>x</sub> p(x) · log₂ p(x)
						<span className="ml-2 text-muted-foreground">bits</span>
					</div>
				</header>

				{/* ── Module 1: Surprise ─────────────────────────────── */}
				<section className="space-y-4 rounded-xl border border-border p-6">
					<div>
						<h2 className="text-xl font-semibold">1 · Surprise = −log₂ p</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Every outcome carries <strong>self-information</strong>: how startled you should be to
							see it. Certain things (p = 1) carry 0 bits; halving an event&rsquo;s probability adds
							exactly one bit of surprise. Entropy is just the average of this over all outcomes.
						</p>
					</div>
					<div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
						<label className="block">
							<span className="mb-2 block text-sm">
								Probability of the event: <span className="font-mono">{fmt(surpriseP, 3)}</span>{" "}
								<span className="text-muted-foreground">(≈ 1 in {fmt(1 / surpriseP, 1)})</span>
							</span>
							<input
								type="range"
								min={1}
								max={999}
								value={Math.round(surpriseP * 1000)}
								onChange={(e) => setSurpriseP(Number(e.target.value) / 1000)}
								className="w-full accent-violet-500"
							/>
						</label>
						<div className="rounded-lg bg-violet-500/10 px-6 py-4 text-center">
							<div className="font-mono text-3xl font-bold text-violet-400">
								{fmt(surprise(surpriseP), 2)}
							</div>
							<div className="text-xs text-muted-foreground">bits of surprise</div>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						A fair coin flip (p = 0.5) → 1 bit. A fair die face (p = 1/6) →{" "}
						{fmt(surprise(1 / 6), 2)} bits. Guessing a byte (p = 1/256) → 8 bits.
					</p>
				</section>

				{/* ── Module 2: Binary entropy function ──────────────── */}
				<section className="space-y-4 rounded-xl border border-border p-6">
					<div>
						<h2 className="text-xl font-semibold">2 · The Binary Entropy Function H₂(p)</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							For a two-outcome source (a biased coin), entropy traces a concave arch. It is{" "}
							<strong>maximal (1 bit) at p = 0.5</strong> — maximum uncertainty — and collapses to 0
							at the certain outcomes. Drag the point along the curve.
						</p>
					</div>
					<div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
						<BinaryEntropyCurve p={binP} onChange={setBinP} />
						<div className="space-y-3">
							<div className="rounded-lg border border-border bg-card/60 p-4">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">p(A)</span>
									<span className="font-mono">{fmt(binP, 3)}</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">p(B)</span>
									<span className="font-mono">{fmt(1 - binP, 3)}</span>
								</div>
								<div className="mt-2 flex justify-between border-t border-border pt-2 text-sm">
									<span>H₂(p)</span>
									<span className="font-mono font-bold text-violet-400">
										{fmt(entropy([binP, 1 - binP]), 3)} bits
									</span>
								</div>
							</div>
							<div className="flex flex-wrap gap-2">
								{[0.5, 0.11, 0.01].map((v) => (
									<button
										key={v}
										type="button"
										onClick={() => setBinP(v)}
										className="rounded border border-border px-3 py-1 text-xs hover:bg-accent"
									>
										p = {v}
									</button>
								))}
							</div>
							<p className="text-xs text-muted-foreground">
								Concavity is why <strong>mixing distributions never decreases entropy</strong> — a
								fact that underlies Jensen&rsquo;s inequality and the whole maximum-entropy
								principle.
							</p>
						</div>
					</div>
				</section>

				{/* ── Module 3: Distribution explorer ────────────────── */}
				<section className="space-y-5 rounded-xl border border-border p-6">
					<div>
						<h2 className="text-xl font-semibold">3 · Distribution Explorer</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Drag the bars to reshape a 6-outcome distribution and watch entropy respond. Spread
							the mass out → entropy climbs toward its ceiling log₂ 6. Concentrate it on one outcome
							→ entropy falls toward 0.
						</p>
					</div>

					<EntropyBars
						probs={dist}
						onChange={setDist}
						labels={OUTCOME_LABELS.slice(0, n)}
						annotate={(i) => `${fmt(surprise(dist[i]), 1)}b`}
					/>

					<div className="flex flex-wrap gap-2">
						{Object.keys(PRESETS).map((name) => (
							<button
								key={name}
								type="button"
								onClick={() => setDist([...PRESETS[name]])}
								className="rounded border border-border px-3 py-1 text-xs hover:bg-accent"
							>
								{name}
							</button>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<Stat label="Entropy H(X)" value={`${fmt(h, 3)} bits`} accent />
						<Stat label="Maximum log₂ 6" value={`${fmt(hMax, 3)} bits`} />
						<Stat label="Perplexity 2^H" value={`${fmt(ppl, 2)} outcomes`} />
					</div>

					{/* Entropy-vs-ceiling gauge */}
					<div>
						<div className="mb-1 flex justify-between text-xs text-muted-foreground">
							<span>0</span>
							<span>fraction of maximum entropy: {fmt((h / hMax) * 100, 0)}%</span>
							<span>log₂ 6</span>
						</div>
						<div className="h-3 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-[width] duration-150"
								style={{ width: `${(h / hMax) * 100}%` }}
							/>
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						The annotation above each bar is that outcome&rsquo;s surprise in bits; entropy is the
						probability-weighted average of those numbers. Perplexity — 2 raised to the entropy —
						reads entropy back as an &ldquo;effective number of equally-likely choices&rdquo;.
					</p>
				</section>

				{/* ── Properties / laws ──────────────────────────────── */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Laws &amp; Deductions</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{ENTROPY_LAWS.map((law) => (
							<div key={law.title} className="rounded-xl border border-border bg-card/40 p-5">
								<h3 className="font-semibold text-violet-400">{law.title}</h3>
								<p className="mt-1 font-mono text-xs text-muted-foreground">{law.formula}</p>
								<p className="mt-2 text-sm">{law.body}</p>
							</div>
						))}
					</div>
				</section>

				<div className="flex justify-between border-t border-border pt-6 text-sm">
					<Link href="/information-theory" className="text-violet-400 hover:underline">
						← Information Theory
					</Link>
					<Link
						href="/information-theory/cross-entropy"
						className="text-violet-400 hover:underline"
					>
						Cross-Entropy &amp; KL Divergence →
					</Link>
				</div>
			</div>
		</div>
	);
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
	return (
		<div className="rounded-lg border border-border bg-card/60 p-4 text-center">
			<div className={`font-mono text-2xl font-bold ${accent ? "text-violet-400" : ""}`}>
				{value}
			</div>
			<div className="mt-1 text-xs text-muted-foreground">{label}</div>
		</div>
	);
}

const ENTROPY_LAWS: Array<{ title: string; formula: string; body: string }> = [
	{
		title: "Non-negativity",
		formula: "H(X) ≥ 0",
		body: "Surprise is never negative, so neither is its average. Entropy is 0 exactly when the outcome is certain (one p(x) = 1).",
	},
	{
		title: "Maximum at uniform",
		formula: "H(X) ≤ log₂ n,  equality ⇔ uniform",
		body: "Among all distributions on n outcomes, the uniform one is the most uncertain. This is the maximum-entropy principle: absent constraints, assume the flattest distribution.",
	},
	{
		title: "Concavity",
		formula: "H(λp + (1−λ)q) ≥ λH(p) + (1−λ)H(q)",
		body: "Entropy is concave in the distribution — blending two distributions can only add uncertainty. The binary-entropy arch above is the n = 2 picture of this.",
	},
	{
		title: "Chain rule",
		formula: "H(X, Y) = H(X) + H(Y | X)",
		body: "The information in a pair is the information in the first plus the leftover information in the second once the first is known.",
	},
	{
		title: "Conditioning cannot increase entropy",
		formula: "H(X | Y) ≤ H(X)",
		body: "On average, learning something (Y) never makes X more uncertain. Equality holds iff X and Y are independent — side information only helps.",
	},
	{
		title: "Mutual information",
		formula: "I(X; Y) = H(X) − H(X | Y) ≥ 0",
		body: "The entropy drop from conditioning is exactly the information Y carries about X — symmetric, non-negative, and zero iff X ⟂ Y.",
	},
	{
		title: "Additivity (independence)",
		formula: "H(X, Y) = H(X) + H(Y)  if  X ⟂ Y",
		body: "Independent sources' uncertainties simply add — the reason bits from independent coin flips accumulate linearly.",
	},
	{
		title: "Source-coding theorem (Shannon)",
		formula: "H(X) ≤ E[len] < H(X) + 1",
		body: "Entropy is the hard lower bound on the average code length of any lossless code, and Huffman/arithmetic coding get within one bit of it. Optimal code length for x ≈ −log₂ p(x).",
	},
];
