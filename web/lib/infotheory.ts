// Information-theory math — pure, dependency-free helpers used by the
// interactive /information-theory exhibits. All quantities are in the chosen
// base (default 2 → bits; e → nats; 10 → dits/hartleys).

export type LogBase = 2 | 10 | typeof Math.E;

export const BASE_LABEL: Record<string, string> = {
	"2": "bits",
	"10": "dits",
	[String(Math.E)]: "nats",
};

/** Logarithm in an arbitrary base. log_b(0) is treated as -Infinity. */
export function logBase(x: number, base: number): number {
	if (x <= 0) return Number.NEGATIVE_INFINITY;
	return Math.log(x) / Math.log(base);
}

/** Normalize non-negative weights into a probability distribution.
 *  An all-zero (or invalid) input falls back to the uniform distribution. */
export function normalize(weights: number[]): number[] {
	const clean = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
	const sum = clean.reduce((a, b) => a + b, 0);
	if (sum <= 0) return weights.map(() => 1 / weights.length);
	return clean.map((w) => w / sum);
}

/** Self-information / "surprise" of an event: -log_b(p). Rare ⇒ surprising. */
export function surprise(p: number, base = 2): number {
	if (p <= 0) return Number.POSITIVE_INFINITY;
	return -logBase(p, base);
}

/** Shannon entropy H(p) = -Σ p_i log_b p_i. Uses the 0·log0 = 0 convention. */
export function entropy(p: number[], base = 2): number {
	let h = 0;
	for (const pi of p) {
		if (pi > 0) h -= pi * logBase(pi, base);
	}
	return h;
}

/** Binary entropy H₂(p) = -p log p - (1-p) log(1-p). Maxes at p = 0.5. */
export function binaryEntropy(p: number, base = 2): number {
	return entropy([p, 1 - p], base);
}

/** Cross-entropy H(p, q) = -Σ p_i log_b q_i.
 *  Infinite when the model q assigns zero mass to an outcome p deems possible. */
export function crossEntropy(p: number[], q: number[], base = 2): number {
	let ce = 0;
	for (let i = 0; i < p.length; i++) {
		if (p[i] > 0) {
			if (q[i] <= 0) return Number.POSITIVE_INFINITY;
			ce -= p[i] * logBase(q[i], base);
		}
	}
	return ce;
}

/** Kullback–Leibler divergence D(p ‖ q) = Σ p_i log_b(p_i / q_i) ≥ 0.
 *  Zero iff p == q; asymmetric; infinite where q_i = 0 < p_i. */
export function klDivergence(p: number[], q: number[], base = 2): number {
	let d = 0;
	for (let i = 0; i < p.length; i++) {
		if (p[i] > 0) {
			if (q[i] <= 0) return Number.POSITIVE_INFINITY;
			d += p[i] * logBase(p[i] / q[i], base);
		}
	}
	return d;
}

/** Maximum possible entropy over n outcomes (attained by the uniform dist). */
export function maxEntropy(n: number, base = 2): number {
	return logBase(n, base);
}

/** Perplexity = base^entropy — the "effective number of equally-likely choices". */
export function perplexity(p: number[], base = 2): number {
	return base ** entropy(p, base);
}

/** Round for display without trailing float noise. */
export function fmt(x: number, digits = 3): string {
	if (!Number.isFinite(x)) return x > 0 ? "∞" : "−∞";
	const s = x.toFixed(digits);
	// Strip trailing zeros only after the decimal point. The old /\.?0+$/ made
	// the point optional, so at digits=0 (no point in the output) it ate the
	// number's own trailing zeros — rendering 100 as "1". Guarding on "." keeps
	// whole numbers intact.
	return s.includes(".") ? s.replace(/\.?0+$/, "") || "0" : s;
}

// ── Joint distributions & mutual information ──────────────────────────────

/** Row (X) and column (Y) marginals of a joint distribution P(X, Y). */
export function marginals(joint: number[][]): { px: number[]; py: number[] } {
	const rows = joint.length;
	const cols = joint[0]?.length ?? 0;
	const px = new Array(rows).fill(0);
	const py = new Array(cols).fill(0);
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			px[i] += joint[i][j];
			py[j] += joint[i][j];
		}
	}
	return { px, py };
}

/** Joint entropy H(X, Y) — entropy of the flattened joint distribution. */
export function jointEntropy(joint: number[][], base = 2): number {
	return entropy(joint.flat(), base);
}

/**
 * Mutual information I(X; Y) = Σ p(x,y) log( p(x,y) / (p(x)p(y)) ) ≥ 0.
 * Equals H(X) + H(Y) − H(X, Y). Zero iff X and Y are independent.
 */
export function mutualInformation(joint: number[][], base = 2): number {
	const { px, py } = marginals(joint);
	let mi = 0;
	for (let i = 0; i < joint.length; i++) {
		for (let j = 0; j < joint[i].length; j++) {
			const p = joint[i][j];
			if (p > 0 && px[i] > 0 && py[j] > 0) {
				mi += p * logBase(p / (px[i] * py[j]), base);
			}
		}
	}
	return Math.max(0, mi); // clamp away tiny negative float error
}

/**
 * Set entry `index` of a distribution to probability `p`, redistributing the
 * remaining mass across the others in proportion to their current mass
 * (uniformly if they are all zero). Keeps the distribution summing to 1.
 */
export function redistribute(probs: number[], index: number, p: number): number[] {
	const clamped = Math.max(0, Math.min(0.999, p));
	const remaining = 1 - clamped;
	const othersSum = probs.reduce((acc, v, i) => (i === index ? acc : acc + v), 0);
	return probs.map((v, i) => {
		if (i === index) return clamped;
		if (othersSum <= 0) return remaining / (probs.length - 1);
		return (v / othersSum) * remaining;
	});
}

// ── Maximum entropy ───────────────────────────────────────────────────────

/**
 * The maximum-entropy distribution over `values` subject to a fixed mean.
 * The solution is the Boltzmann/Gibbs form p_i ∝ exp(λ·x_i); we solve for λ
 * so that E[X] = targetMean. With no effective constraint (target = the
 * unconstrained mean) this returns the uniform distribution.
 */
export function maxEntByMean(
	values: number[],
	targetMean: number,
	base = 2,
): { probs: number[]; lambda: number; achievedMean: number; entropy: number } {
	const lo = Math.min(...values);
	const hi = Math.max(...values);
	const target = Math.max(lo + 1e-6, Math.min(hi - 1e-6, targetMean));

	// probs and mean for a given λ (numerically stable via max-subtraction).
	const dist = (lambda: number): { probs: number[]; mean: number } => {
		const m = Math.max(...values.map((v) => lambda * v));
		const w = values.map((v) => Math.exp(lambda * v - m));
		const z = w.reduce((a, b) => a + b, 0);
		const probs = w.map((wi) => wi / z);
		const mean = probs.reduce((acc, pi, i) => acc + pi * values[i], 0);
		return { probs, mean };
	};

	// mean(λ) is monotonically increasing in λ → bisection.
	let lambdaLo = -60;
	let lambdaHi = 60;
	for (let iter = 0; iter < 100; iter++) {
		const mid = (lambdaLo + lambdaHi) / 2;
		if (dist(mid).mean < target) lambdaLo = mid;
		else lambdaHi = mid;
	}
	const lambda = (lambdaLo + lambdaHi) / 2;
	const { probs, mean } = dist(lambda);
	return { probs, lambda, achievedMean: mean, entropy: entropy(probs, base) };
}
