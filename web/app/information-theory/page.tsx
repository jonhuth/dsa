"use client";

import Link from "next/link";
import { useState } from "react";
import { BinaryEntropyCurve } from "@/components/infotheory/BinaryEntropyCurve";
import { entropy, fmt } from "@/lib/infotheory";

export default function InformationTheoryPage() {
	const [p, setP] = useState(0.5);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-12">
				{/* Breadcrumb */}
				<div className="text-sm text-muted-foreground">
					<Link href="/" className="hover:underline">
						Home
					</Link>{" "}
					/ Information Theory
				</div>

				{/* Hero */}
				<header className="space-y-4">
					<span className="inline-block rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
						Interactive · Foundations
					</span>
					<h1 className="text-4xl font-bold sm:text-5xl">Entropy &amp; the Laws of Information</h1>
					<p className="max-w-3xl text-lg text-muted-foreground">
						One idea — <em>surprise, measured in bits</em> — ripples into a small family of
						quantities that govern compression, communication, and machine learning. These exhibits
						let you drag the distributions and watch the laws hold.
					</p>
				</header>

				{/* Teaser */}
				<section className="grid items-center gap-8 rounded-2xl border border-border bg-card/40 p-6 lg:grid-cols-[1.3fr_1fr]">
					<BinaryEntropyCurve p={p} onChange={setP} />
					<div className="space-y-3">
						<h2 className="text-xl font-semibold">Start here: a single biased coin</h2>
						<p className="text-sm text-muted-foreground">
							Its entropy is maximal (1 bit) when the coin is fair and drops to nothing when the
							outcome is a foregone conclusion. Drag the dot.
						</p>
						<div className="font-mono text-sm">
							p = {fmt(p, 2)} &nbsp;→&nbsp;{" "}
							<span className="text-violet-400">H = {fmt(entropy([p, 1 - p]), 3)} bits</span>
						</div>
						<Link
							href="/information-theory/entropy"
							className="inline-block rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
						>
							Explore Shannon Entropy →
						</Link>
					</div>
				</section>

				{/* The map of quantities */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">The family of quantities</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{QUANTITIES.map((q) => (
							<div key={q.name} className="rounded-xl border border-border bg-card/40 p-5">
								<div className="font-mono text-sm text-violet-400">{q.symbol}</div>
								<h3 className="mt-1 font-semibold">{q.name}</h3>
								<p className="mt-1 text-xs text-muted-foreground">{q.gloss}</p>
							</div>
						))}
					</div>
					<div className="rounded-xl border border-border bg-card/60 p-5 font-mono text-sm leading-relaxed">
						<div>
							<span className="text-violet-400">H(p, q)</span> = H(p) +{" "}
							<span className="text-amber-400">D(p‖q)</span>
							<span className="ml-3 text-muted-foreground">
								{"// cross-entropy = irreducible entropy + wasted bits"}
							</span>
						</div>
						<div className="mt-1">
							<span className="text-sky-400">I(X; Y)</span> = H(X) − H(X|Y) = H(X) + H(Y) − H(X, Y)
							<span className="ml-3 text-muted-foreground">{"// mutual information"}</span>
						</div>
					</div>
				</section>

				{/* Exhibits */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Exhibits</h2>
					<div className="grid gap-5 sm:grid-cols-2">
						<Link
							href="/information-theory/entropy"
							className="group rounded-2xl border border-border p-6 transition-colors hover:bg-accent"
						>
							<h3 className="text-xl font-semibold group-hover:text-violet-400">Shannon Entropy</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Surprise as −log₂ p, the binary-entropy arch, and a drag-to-reshape distribution
								explorer with the entropy ceiling log₂ n. Eight laws, from concavity to
								Shannon&rsquo;s source-coding theorem.
							</p>
							<span className="mt-3 inline-block text-sm text-violet-400">Open exhibit →</span>
						</Link>
						<Link
							href="/information-theory/cross-entropy"
							className="group rounded-2xl border border-border p-6 transition-colors hover:bg-accent"
						>
							<h3 className="text-xl font-semibold group-hover:text-violet-400">
								Cross-Entropy &amp; KL Divergence
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Two distributions, one identity: H(p,q) = H(p) + D(p‖q). Watch the wasted-bits
								surcharge, the per-symbol coding bill, the mean- vs mode-seeking asymmetry, and why
								classifiers minimize it.
							</p>
							<span className="mt-3 inline-block text-sm text-violet-400">Open exhibit →</span>
						</Link>
						<Link
							href="/information-theory/mutual-information"
							className="group rounded-2xl border border-border p-6 transition-colors hover:bg-accent"
						>
							<h3 className="text-xl font-semibold group-hover:text-violet-400">
								Mutual Information
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Edit a joint distribution and watch the entropy circles overlap: I(X;Y) = H(X) +
								H(Y) − H(X,Y). The shared bits, the data-processing inequality, and the link to
								channel capacity.
							</p>
							<span className="mt-3 inline-block text-sm text-violet-400">Open exhibit →</span>
						</Link>
						<Link
							href="/information-theory/max-entropy"
							className="group rounded-2xl border border-border p-6 transition-colors hover:bg-accent"
						>
							<h3 className="text-xl font-semibold group-hover:text-violet-400">Maximum Entropy</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Constrain a die&rsquo;s mean and drag it: the honest, least-committal distribution
								emerges as the Boltzmann form p ∝ e^(λx). How constraints pick uniform, exponential,
								and Gaussian — and why softmax is a max-ent model.
							</p>
							<span className="mt-3 inline-block text-sm text-violet-400">Open exhibit →</span>
						</Link>
						<Link
							href="/information-theory/kolmogorov"
							className="group rounded-2xl border border-border p-6 transition-colors hover:bg-accent sm:col-span-2"
						>
							<h3 className="text-xl font-semibold group-hover:text-violet-400">
								Kolmogorov Complexity
							</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								From distributions to a single object: the shortest program that prints x. Compress
								live text in your browser to bound it, see why most strings are incompressible, and
								meet the uncomputable — the invariance theorem, MDL/Occam, and Chaitin&rsquo;s Ω.
							</p>
							<span className="mt-3 inline-block text-sm text-violet-400">Open exhibit →</span>
						</Link>
					</div>
				</section>

				{/* Why it matters */}
				<section className="space-y-3 rounded-2xl border border-border bg-card/40 p-6">
					<h2 className="text-xl font-semibold">What you can deduce from these laws</h2>
					<ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
						<li>
							• A lossless code can&rsquo;t beat H(X) bits/symbol — the compression speed limit.
						</li>
						<li>
							• The flattest distribution consistent with your constraints is the honest prior
							(max-entropy).
						</li>
						<li>
							• Training a classifier = minimizing KL from data to model = maximum likelihood.
						</li>
						<li>
							• Mutual information ≥ 0 quantifies exactly how much one variable tells you about
							another.
						</li>
						<li>
							• Conditioning never increases entropy — evidence can only reduce uncertainty on
							average.
						</li>
						<li>
							• A confidently-wrong probability (q = 0) costs infinite bits — hence softmax &amp;
							smoothing.
						</li>
					</ul>
				</section>
			</div>
		</div>
	);
}

const QUANTITIES: Array<{ symbol: string; name: string; gloss: string }> = [
	{
		symbol: "H(X)",
		name: "Entropy",
		gloss: "Average surprise of a source — the bits it truly needs.",
	},
	{
		symbol: "H(p, q)",
		name: "Cross-entropy",
		gloss: "Bits to describe p using a code built for q — the ML loss.",
	},
	{
		symbol: "D(p‖q)",
		name: "KL divergence",
		gloss: "Wasted bits from believing q when reality is p. ≥ 0, asymmetric.",
	},
	{
		symbol: "I(X;Y)",
		name: "Mutual information",
		gloss: "How many bits X and Y share — the entropy drop from conditioning.",
	},
];
