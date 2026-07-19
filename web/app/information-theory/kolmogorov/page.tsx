"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fmt } from "@/lib/infotheory";

/** gzip byte length via the browser's CompressionStream — a computable
 *  upper bound on Kolmogorov complexity. Falls back to raw size if the API
 *  is unavailable. gzip carries a fixed ~18-byte header/footer: that constant
 *  overhead is a concrete stand-in for the "+ c" in the invariance theorem. */
async function gzipBytes(text: string): Promise<number> {
	if (typeof text !== "string") return 0;
	const encoded = new TextEncoder().encode(text);
	if (typeof CompressionStream === "undefined") return encoded.byteLength;
	const stream = new Blob([encoded]).stream().pipeThrough(new CompressionStream("gzip"));
	const buf = await new Response(stream).arrayBuffer();
	return buf.byteLength;
}

const GZIP_OVERHEAD = 18; // fixed gzip header+footer bytes

const PRESETS: Record<string, string> = {
	Repetitive: "a".repeat(400),
	Structured: "abcd".repeat(100),
	"Natural language":
		"the quick brown fox jumps over the lazy dog. pack my box with five dozen liquor jugs. how vexingly quick daft zebras jump. sphinx of black quartz, judge my vow. ".repeat(
			2,
		),
	Random: "",
};

function randomString(len: number): string {
	const alphabet = "0123456789abcdef";
	let s = "";
	for (let i = 0; i < len; i++) {
		// Deterministic-enough pseudo-random for a demo; variety per keystroke.
		s += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return s;
}

export default function KolmogorovPage() {
	const [text, setText] = useState<string>(PRESETS.Structured);
	const [gzip, setGzip] = useState<number | null>(null);

	const rawBytes = useMemo(() => new TextEncoder().encode(text).length, [text]);

	useEffect(() => {
		let alive = true;
		gzipBytes(text).then((b) => {
			if (alive) setGzip(b);
		});
		return () => {
			alive = false;
		};
	}, [text]);

	const effective = gzip === null ? null : Math.max(0, gzip - GZIP_OVERHEAD);
	const ratio = gzip === null || rawBytes === 0 ? null : effective! / rawBytes;
	const compressibility = ratio === null ? 0 : Math.max(0, Math.min(1, 1 - ratio));

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-5xl space-y-10">
				<div className="text-sm text-muted-foreground">
					<Link href="/information-theory" className="hover:underline">
						Information Theory
					</Link>{" "}
					/ Kolmogorov Complexity
				</div>

				<header className="space-y-3">
					<h1 className="text-3xl font-bold sm:text-4xl">Kolmogorov Complexity</h1>
					<p className="max-w-3xl text-muted-foreground">
						Shannon entropy needs a probability distribution. Kolmogorov complexity throws that away
						and asks about a <em>single object</em>: K(x) is the length of the{" "}
						<strong>shortest program</strong> that prints x and halts. It is the ultimate limit of
						compression — and, remarkably, it is <strong>uncomputable</strong>. But any compressor
						gives an upper bound, so we can still play.
					</p>
					<div className="rounded-lg border border-border bg-card/60 p-4 font-mono text-sm">
						K(x) = min &#123; |p| : U(p) = x &#125;
						<span className="ml-2 text-muted-foreground">
							shortest program p that outputs x on a universal machine U
						</span>
					</div>
				</header>

				{/* ── Interactive compressor ─────────────────────────── */}
				<section className="space-y-4 rounded-xl border border-border p-6">
					<div>
						<h2 className="text-xl font-semibold">Compress-to-estimate</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Type or paste anything. We gzip it in your browser — a real, computable compressor —
							to get an <strong>upper bound</strong> on its complexity. Regular strings shrink to
							almost nothing; random strings barely budge. That gap <em>is</em> Kolmogorov&rsquo;s
							idea.
						</p>
					</div>

					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={4}
						className="w-full rounded-lg border border-border bg-background p-3 font-mono text-sm"
						placeholder="Type a string…"
					/>

					<div className="flex flex-wrap gap-2">
						{Object.keys(PRESETS).map((name) => (
							<button
								key={name}
								type="button"
								onClick={() => setText(name === "Random" ? randomString(400) : PRESETS[name])}
								className="rounded border border-border px-3 py-1 text-xs hover:bg-accent"
							>
								{name}
								{name === "Random" ? " (400)" : ""}
							</button>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<Stat label="Raw size" value={`${rawBytes}`} unit="bytes" />
						<Stat
							label="Compressed (gzip − header)"
							value={effective === null ? "…" : `${effective}`}
							unit="bytes"
							className="text-sky-400"
						/>
						<Stat
							label="Compressibility"
							value={`${fmt(compressibility * 100, 0)}`}
							unit="%"
							className="text-violet-400"
						/>
					</div>

					<div>
						<div className="mb-1 flex justify-between text-xs text-muted-foreground">
							<span>incompressible (random ⇒ high K)</span>
							<span>compressible (structured ⇒ low K)</span>
						</div>
						<div className="h-3 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-[width] duration-150"
								style={{ width: `${(compressibility * 100).toFixed(4)}%` }}
							/>
						</div>
					</div>

					<p className="text-xs text-muted-foreground">
						gzip adds a fixed ~{GZIP_OVERHEAD}-byte header/footer regardless of input — a tangible
						version of the <span className="font-mono">+ c</span> constant in the invariance
						theorem: switching compilers (or compressors) changes K by at most a constant.
					</p>
				</section>

				{/* ── Relationship to entropy ────────────────────────── */}
				<section className="space-y-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-6">
					<h2 className="text-xl font-semibold">Algorithmic vs. probabilistic information</h2>
					<div className="grid gap-4 text-sm sm:grid-cols-2">
						<div>
							<h3 className="font-semibold text-violet-400">Shannon H(X)</h3>
							<p className="mt-1 text-muted-foreground">
								Needs a source with a distribution. Measures the average bits over many draws. A
								property of the <em>ensemble</em>.
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-sky-400">Kolmogorov K(x)</h3>
							<p className="mt-1 text-muted-foreground">
								Needs nothing but the object. Measures the bits in <em>this one string</em>. A
								property of the <em>individual</em>.
							</p>
						</div>
					</div>
					<p className="text-sm">
						They meet in the limit: <span className="font-mono">E[K(X)] ≈ H(X) + O(1)</span> for a
						string drawn from a computable source. Entropy is the expected Kolmogorov complexity —
						the average shortest description length.
					</p>
				</section>

				{/* ── Laws ───────────────────────────────────────────── */}
				<section className="space-y-4">
					<h2 className="text-2xl font-semibold">Laws &amp; Deductions</h2>
					<div className="grid gap-4 sm:grid-cols-2">
						{K_LAWS.map((law) => (
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
			<div className={`font-mono text-2xl font-bold ${className ?? ""}`}>
				{value}
				{unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
			</div>
			<div className="mt-1 text-xs text-muted-foreground">{label}</div>
		</div>
	);
}

const K_LAWS: Array<{ title: string; formula: string; body: string }> = [
	{
		title: "Invariance theorem",
		formula: "|K_U(x) − K_V(x)| ≤ c",
		body: "The choice of universal machine (or programming language) shifts complexity by only a constant. K is well-defined up to O(1) — that is why 'shortest program' is a meaningful notion at all.",
	},
	{
		title: "Upper bound",
		formula: "K(x) ≤ |x| + c",
		body: "You can always print x with a program that literally embeds x. So no string is much harder to describe than just writing it out.",
	},
	{
		title: "Incompressibility",
		formula: "#{x : K(x) < n − k} < 2^(n−k)",
		body: "A simple counting argument: there aren't enough short programs to go around. Most strings of length n are essentially random — incompressible — with K(x) ≈ n.",
	},
	{
		title: "Uncomputability",
		formula: "K is not computable",
		body: "No algorithm computes K(x) for all x — it would solve the halting problem (via Berry's paradox: 'the shortest string not describable in fewer than N bits'). Compressors only ever give upper bounds.",
	},
	{
		title: "Entropy connection",
		formula: "E[K(X)] = H(X) + O(1)",
		body: "Average algorithmic complexity equals Shannon entropy. The two notions of 'information' — individual and statistical — coincide in expectation.",
	},
	{
		title: "Occam's razor / MDL",
		formula: "best model = argmin [ K(model) + K(data | model) ]",
		body: "The shortest description that explains the data is the best hypothesis. Minimum Description Length turns Occam's razor into a formal, computable-approximation learning principle.",
	},
	{
		title: "Chaitin's Ω",
		formula: "Ω = Σ 2^(−|p|) over halting p",
		body: "The halting probability is a specific, perfectly-defined real number that is algorithmically random: its bits are incompressible and uncomputable. Knowing its first n bits would settle the halting problem for all programs up to length n.",
	},
	{
		title: "Randomness = incompressibility",
		formula: "x is random ⇔ K(x) ≈ |x|",
		body: "This gives a rigorous definition of an individual random string — no distribution required. A sequence is Martin-Löf random exactly when its prefixes cannot be compressed.",
	},
];
