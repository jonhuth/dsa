"use client";

import Link from "next/link";
import { useState } from "react";
import { JointGrid } from "@/components/infotheory/JointGrid";
import { entropy, fmt, jointEntropy, marginals, mutualInformation } from "@/lib/infotheory";

const XL = ["x₀", "x₁", "x₂"];
const YL = ["y₀", "y₁", "y₂"];

const PRESETS: Record<string, number[][]> = {
	Correlated: [
		[0.33, 0, 0],
		[0, 0.34, 0],
		[0, 0, 0.33],
	],
	Independent: [
		[0.16, 0.14, 0.1],
		[0.14, 0.1225, 0.0875],
		[0.1, 0.0875, 0.0625],
	],
	Noisy: [
		[0.24, 0.06, 0.02],
		[0.05, 0.28, 0.05],
		[0.02, 0.06, 0.22],
	],
	Uniform: [
		[1 / 9, 1 / 9, 1 / 9],
		[1 / 9, 1 / 9, 1 / 9],
		[1 / 9, 1 / 9, 1 / 9],
	],
};

export default function MutualInformationPage() {
	const [joint, setJoint] = useState<number[][]>(PRESETS.Noisy.map((r) => [...r]));

	const { px, py } = marginals(joint);
	const hX = entropy(px);
	const hY = entropy(py);
	const hXY = jointEntropy(joint);
	const mi = mutualInformation(joint);
	const hXgivenY = Math.max(0, hXY - hY); // H(X|Y)
	const hYgivenX = Math.max(0, hXY - hX); // H(Y|X)

	// Three-segment decomposition of H(X,Y) = H(X|Y) + I(X;Y) + H(Y|X).
	// Percentages are rounded to fixed precision so the server- and
	// client-rendered style strings match exactly (avoids hydration mismatch).
	const total = Math.max(hXY, 1e-9);
	const seg = (v: number) => `${((v / total) * 100).toFixed(4)}%`;

	// Venn: overlap grows with I relative to the smaller circle. Coordinates are
	// pre-rounded to fixed strings so server and client render identical SVG
	// attributes (avoids hydration mismatch on float serialization).
	const overlapRatio = Math.min(hX, hY) > 0 ? mi / Math.min(hX, hY) : 0;
	const r = 66;
	const d = 2 * r * (1 - Math.min(1, overlapRatio)); // center separation
	const cx = 160;
	const cy = 90;
	const leftCx = (cx - d / 2).toFixed(2);
	const rightCx = (cx + d / 2).toFixed(2);
	const leftLabelX = (cx - d / 2 - r / 2).toFixed(2);
	const rightLabelX = (cx + d / 2 + r / 2).toFixed(2);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-10">
				<div className="text-sm text-muted-foreground">
					<Link href="/information-theory" className="hover:underline">
						Information Theory
					</Link>{" "}
					/ Mutual Information
				</div>

				<header className="space-y-3">
					<h1 className="text-3xl font-bold sm:text-4xl">Mutual Information</h1>
					<p className="max-w-3xl text-muted-foreground">
						How many bits does knowing one variable tell you about another? Mutual information is
						the overlap of two entropies — the uncertainty in X that <em>evaporates</em> once you
						learn Y (and vice-versa, symmetrically). Edit the joint distribution and watch the
						overlap breathe.
					</p>
					<div className="grid gap-2 rounded-lg border border-border bg-card/60 p-4 font-mono text-sm sm:grid-cols-2">
						<div>I(X;Y) = H(X) − H(X|Y)</div>
						<div className="text-violet-400">= H(X) + H(Y) − H(X, Y)</div>
					</div>
				</header>

				{/* Editor */}
				<section className="space-y-4 rounded-xl border border-border p-6">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<h2 className="text-xl font-semibold">Joint distribution P(X, Y)</h2>
						<div className="flex flex-wrap gap-2">
							{Object.keys(PRESETS).map((name) => (
								<button
									key={name}
									type="button"
									onClick={() => setJoint(PRESETS[name].map((r) => [...r]))}
									className="rounded border border-border px-3 py-1 text-xs hover:bg-accent"
								>
									{name}
								</button>
							))}
						</div>
					</div>
					<JointGrid joint={joint} onChange={setJoint} xLabels={XL} yLabels={YL} />
					<p className="text-xs text-muted-foreground">
						The emerald bars are the marginal P(X); the sky bars are P(Y). Set them to the{" "}
						<strong>Independent</strong> preset and I(X;Y) drops to 0 — the joint is exactly the
						product of its marginals. Set <strong>Correlated</strong> (mass on the diagonal) and
						knowing Y pins down X, so I(X;Y) climbs to H(X).
					</p>
				</section>

				{/* Decomposition + Venn */}
				<section className="grid gap-6 rounded-xl border border-border p-6 lg:grid-cols-[1fr_320px]">
					<div className="space-y-5">
						<h2 className="text-xl font-semibold">H(X, Y) = H(X|Y) + I(X;Y) + H(Y|X)</h2>
						<div>
							<div className="flex h-11 w-full overflow-hidden rounded-lg bg-muted text-xs font-medium">
								<div
									className="flex items-center justify-center bg-emerald-500/80"
									style={{ width: seg(hXgivenY) }}
									title="H(X|Y): uncertainty left in X after learning Y"
								>
									{hXgivenY / total > 0.12 ? "H(X|Y)" : ""}
								</div>
								<div
									className="flex items-center justify-center bg-violet-500/85"
									style={{ width: seg(mi) }}
									title="I(X;Y): shared information"
								>
									{mi / total > 0.1 ? "I" : ""}
								</div>
								<div
									className="flex items-center justify-center bg-sky-500/80"
									style={{ width: seg(hYgivenX) }}
									title="H(Y|X): uncertainty left in Y after learning X"
								>
									{hYgivenX / total > 0.12 ? "H(Y|X)" : ""}
								</div>
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								Total width is the joint entropy H(X, Y). The violet middle — counted once, not
								twice — is the mutual information.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							<Stat label="H(X)" value={fmt(hX, 3)} className="text-emerald-400" />
							<Stat label="H(Y)" value={fmt(hY, 3)} className="text-sky-400" />
							<Stat label="H(X, Y)" value={fmt(hXY, 3)} />
							<Stat label="H(X | Y)" value={fmt(hXgivenY, 3)} className="text-emerald-400" />
							<Stat label="H(Y | X)" value={fmt(hYgivenX, 3)} className="text-sky-400" />
							<Stat label="I(X; Y)" value={fmt(mi, 3)} className="text-violet-400" />
						</div>
					</div>

					{/* Entropy Venn */}
					<div className="flex flex-col items-center justify-center">
						<svg
							viewBox="0 0 320 180"
							className="w-full max-w-[320px]"
							role="img"
							aria-label="Entropy Venn diagram"
						>
							<title>Entropy Venn diagram</title>
							<circle
								cx={leftCx}
								cy={cy}
								r={r}
								className="fill-emerald-500/25 stroke-emerald-400"
								strokeWidth={1.5}
							/>
							<circle
								cx={rightCx}
								cy={cy}
								r={r}
								className="fill-sky-500/25 stroke-sky-400"
								strokeWidth={1.5}
							/>
							<text
								x={leftLabelX}
								y={cy}
								textAnchor="middle"
								className="fill-emerald-300 text-[10px]"
							>
								H(X|Y)
							</text>
							<text x={rightLabelX} y={cy} textAnchor="middle" className="fill-sky-300 text-[10px]">
								H(Y|X)
							</text>
							<text
								x={cx}
								y={cy - 4}
								textAnchor="middle"
								className="fill-violet-200 text-[11px] font-semibold"
							>
								I(X;Y)
							</text>
							<text x={cx} y={cy + 12} textAnchor="middle" className="fill-violet-200 text-[10px]">
								{fmt(mi, 2)}
							</text>
						</svg>
						<p className="mt-2 text-center text-xs text-muted-foreground">
							Two circles, H(X) and H(Y). Their union is H(X, Y); their overlap is I(X; Y).
						</p>
					</div>
				</section>

				{/* Laws */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Laws &amp; Deductions</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{MI_LAWS.map((law) => (
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
						href="/information-theory/cross-entropy"
						className="text-violet-400 hover:underline"
					>
						← Cross-Entropy &amp; KL
					</Link>
					<Link href="/information-theory/max-entropy" className="text-violet-400 hover:underline">
						Maximum Entropy →
					</Link>
				</div>
			</div>
		</div>
	);
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
	return (
		<div className="rounded-lg border border-border bg-card/60 p-3 text-center">
			<div className={`font-mono text-xl font-bold ${className ?? ""}`}>{value}</div>
			<div className="mt-1 text-[11px] text-muted-foreground">{label}</div>
		</div>
	);
}

const MI_LAWS: Array<{ title: string; formula: string; body: string }> = [
	{
		title: "Non-negativity",
		formula: "I(X; Y) ≥ 0,  = 0 ⇔ X ⟂ Y",
		body: "Information is never negative: learning Y cannot, on average, increase your uncertainty about X. It is zero exactly when the two are independent (the joint factorizes).",
	},
	{
		title: "Symmetry",
		formula: "I(X; Y) = I(Y; X)",
		body: "The bits X reveals about Y equal the bits Y reveals about X — the overlap of two circles doesn't care which you name first.",
	},
	{
		title: "It's a KL divergence",
		formula: "I(X; Y) = D( P(X,Y) ‖ P(X)P(Y) )",
		body: "Mutual information is the KL divergence between the true joint and the independent model — literally how far the variables are from independence, measured in bits.",
	},
	{
		title: "Bounded by either entropy",
		formula: "I(X; Y) ≤ min( H(X), H(Y) )",
		body: "You can't learn more about X than X's own uncertainty. Equality (I = H(X)) means Y determines X completely — a deterministic relationship.",
	},
	{
		title: "Data-processing inequality",
		formula: "X → Y → Z  ⇒  I(X; Z) ≤ I(X; Y)",
		body: "Post-processing can only lose information. No clever function of Y recovers more about X than Y already carried — the backbone of many ML and coding bounds.",
	},
	{
		title: "The channel-capacity link",
		formula: "C = max_{P(X)} I(X; Y)",
		body: "Shannon's channel capacity is the maximum mutual information over input distributions — the ultimate reliable bit-rate through a noisy channel.",
	},
];
