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
	return x.toFixed(digits).replace(/\.?0+$/, "") || "0";
}
