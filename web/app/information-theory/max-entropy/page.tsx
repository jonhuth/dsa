"use client";

import Link from "next/link";
import { useState } from "react";
import { EntropyBars } from "@/components/infotheory/EntropyBars";
import { fmt, maxEntByMean, maxEntropy } from "@/lib/infotheory";

const VALUES = [1, 2, 3, 4, 5, 6];
const LABELS = VALUES.map(String);
const UNIFORM_MEAN = 3.5;

export default function MaxEntropyPage() {
	const [mean, setMean] = useState(3.5);

	const { probs, lambda, achievedMean, entropy: h } = maxEntByMean(VALUES, mean);
	const hMax = maxEntropy(VALUES.length);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-10">
				<div className="text-sm text-muted-foreground">
					<Link href="/information-theory" className="hover:underline">
						Information Theory
					</Link>{" "}
					/ Maximum Entropy
				</div>

				<header className="space-y-3">
					<h1 className="text-3xl font-bold sm:text-4xl">The Maximum-Entropy Principle</h1>
					<p className="max-w-3xl text-muted-foreground">
						Given what you know and nothing more, which distribution should you assume? The one that
						is maximally <em>non-committal</em> — highest entropy — subject to your constraints.
						Anything flatter would ignore the constraints; anything peakier would smuggle in
						assumptions you can&rsquo;t justify.
					</p>
					<div className="rounded-lg border border-border bg-card/60 p-4 font-mono text-sm">
						maximize H(p) subject to Σ p<sub>i</sub> = 1 and E[X] = μ
						<span className="ml-2 text-violet-400">
							⇒ p<sub>i</sub> ∝ e^(λ·x<sub>i</sub>)
						</span>
					</div>
				</header>

				{/* Interactive */}
				<section className="space-y-5 rounded-xl border border-border p-6">
					<div>
						<h2 className="text-xl font-semibold">A loaded die, honestly loaded</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							You&rsquo;re told a six-sided die has average roll <strong>μ</strong> — but nothing
							else. The most honest distribution consistent with that single fact is the max-entropy
							solution: the <strong>Boltzmann distribution</strong> p<sub>i</sub> ∝ e^(λ·i). Drag μ
							and watch it emerge.
						</p>
					</div>

					<label className="block">
						<span className="mb-2 block text-sm">
							Target mean μ = <span className="font-mono">{fmt(mean, 2)}</span>
							{Math.abs(mean - UNIFORM_MEAN) < 0.02 && (
								<span className="ml-2 text-violet-400">(no constraint → uniform)</span>
							)}
						</span>
						<input
							type="range"
							min={110}
							max={590}
							value={Math.round(mean * 100)}
							onChange={(e) => setMean(Number(e.target.value) / 100)}
							className="w-full accent-violet-500"
						/>
						<div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
							<span>1 (all mass on ⚀)</span>
							<span>3.5 (uniform)</span>
							<span>6 (all mass on ⚅)</span>
						</div>
					</label>

					<EntropyBars probs={probs} labels={LABELS} editable={false} height={200} />

					<div className="grid gap-4 sm:grid-cols-4">
						<Stat
							label="Entropy H"
							value={`${fmt(h, 3)}`}
							unit="bits"
							className="text-violet-400"
						/>
						<Stat label="Maximum log₂6" value={`${fmt(hMax, 3)}`} unit="bits" />
						<Stat label="λ (tilt)" value={fmt(lambda, 3)} className="text-amber-400" />
						<Stat label="achieved μ" value={fmt(achievedMean, 3)} />
					</div>

					<div>
						<div className="mb-1 flex justify-between text-xs text-muted-foreground">
							<span>0</span>
							<span>fraction of maximum entropy: {fmt((h / hMax) * 100, 0)}%</span>
							<span>log₂ 6</span>
						</div>
						<div className="h-3 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-[width] duration-100"
								style={{ width: `${((h / hMax) * 100).toFixed(4)}%` }}
							/>
						</div>
					</div>

					<p className="text-xs text-muted-foreground">
						At μ = 3.5 the constraint is vacuous, λ = 0, and the answer is the uniform distribution
						with the greatest possible entropy (log₂6 ≈ 2.585 bits). Push μ toward an edge and the
						distribution tilts into a geometric/exponential shape — entropy falling as the
						constraint bites. This is precisely how statistical mechanics derives the Boltzmann
						distribution, with λ playing the role of −1 / (k·T).
					</p>
				</section>

				{/* Laws */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Which constraint gives which distribution</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{MAXENT_LAWS.map((law) => (
							<div key={law.title} className="rounded-xl border border-border bg-card/40 p-5">
								<h3 className="font-semibold text-violet-400">{law.title}</h3>
								<p className="mt-1 font-mono text-xs text-muted-foreground">{law.formula}</p>
								<p className="mt-2 text-sm">{law.body}</p>
							</div>
						))}
					</div>
				</section>

				<div className="flex justify-between border-t border-border pt-6 text-sm">
					<Link
						href="/information-theory/mutual-information"
						className="text-violet-400 hover:underline"
					>
						← Mutual Information
					</Link>
					<Link href="/information-theory" className="text-violet-400 hover:underline">
						Information Theory
					</Link>
				</div>
			</div>
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
			<div className={`font-mono text-xl font-bold ${className ?? ""}`}>
				{value}
				{unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>}
			</div>
			<div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
		</div>
	);
}

const MAXENT_LAWS: Array<{ title: string; formula: string; body: string }> = [
	{
		title: "No constraint → Uniform",
		formula: "argmax H(p) = uniform",
		body: "Knowing only the list of outcomes, the honest choice is to treat them as equally likely. This is Laplace's principle of indifference, made rigorous.",
	},
	{
		title: "Fixed mean → Exponential / Boltzmann",
		formula: "p_i ∝ e^(λ x_i)",
		body: "One linear constraint (the mean) yields a one-parameter exponential family. On the positive reals this is the exponential distribution; on discrete states it is the Boltzmann distribution of physics.",
	},
	{
		title: "Fixed mean & variance → Gaussian",
		formula: "p(x) ∝ e^(−(x−μ)² / 2σ²)",
		body: "Two moment constraints over the reals give the normal distribution — the deepest reason the Gaussian is 'natural': it assumes the least beyond a mean and a spread.",
	},
	{
		title: "Lagrange multipliers",
		formula: "p_i ∝ exp( Σ_k λ_k f_k(x_i) )",
		body: "Each constraint f_k contributes a multiplier λ_k in the exponent. The max-entropy distribution is always this exponential-family form — solving for the λ's matches the constraints.",
	},
	{
		title: "It's the honest prior",
		formula: "least assumptions ⇔ most entropy",
		body: "Choosing the max-entropy distribution guarantees you inject no information you don't actually have — the formal antidote to overconfident priors.",
	},
	{
		title: "MaxEnt = Logistic / Softmax models",
		formula: "P(y|x) ∝ exp( w · f(x, y) )",
		body: "Maximum-entropy classification under feature-expectation constraints is exactly logistic regression / softmax — the same exponential form, fit by maximum likelihood.",
	},
];
