import { describe, expect, it } from "vitest";
import {
	BASE_LABEL,
	binaryEntropy,
	crossEntropy,
	entropy,
	fmt,
	jointEntropy,
	klDivergence,
	logBase,
	marginals,
	maxEntByMean,
	maxEntropy,
	mutualInformation,
	normalize,
	perplexity,
	redistribute,
	surprise,
} from "./infotheory";

const NATS = Math.E;
const LN2 = Math.LN2;

/** Outer product p(x)p(y) — a joint distribution of independent X, Y. */
function independentJoint(px: number[], py: number[]): number[][] {
	return px.map((x) => py.map((y) => x * y));
}

function transpose(m: number[][]): number[][] {
	return m[0].map((_, j) => m.map((row) => row[j]));
}

describe("logBase", () => {
	it("computes logs in the requested base", () => {
		expect(logBase(8, 2)).toBeCloseTo(3, 12);
		expect(logBase(1000, 10)).toBeCloseTo(3, 12);
		expect(logBase(Math.E ** 2, NATS)).toBeCloseTo(2, 12);
	});

	it("returns 0 for log_b(1) in any base", () => {
		expect(logBase(1, 2)).toBeCloseTo(0, 12);
		expect(logBase(1, 10)).toBeCloseTo(0, 12);
	});

	it("treats non-positive input as -Infinity rather than NaN", () => {
		expect(logBase(0, 2)).toBe(Number.NEGATIVE_INFINITY);
		expect(logBase(-1, 2)).toBe(Number.NEGATIVE_INFINITY);
		expect(Number.isNaN(logBase(-1, 2))).toBe(false);
	});
});

describe("BASE_LABEL", () => {
	it("names the unit for each supported base", () => {
		expect(BASE_LABEL["2"]).toBe("bits");
		expect(BASE_LABEL["10"]).toBe("dits");
		expect(BASE_LABEL[String(Math.E)]).toBe("nats");
	});
});

describe("normalize", () => {
	it("scales weights so they sum to 1", () => {
		const p = normalize([1, 1, 2]);
		expect(p).toEqual([0.25, 0.25, 0.5]);
		expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
	});

	it("leaves an already-normalized distribution alone", () => {
		const p = normalize([0.2, 0.3, 0.5]);
		expect(p[0]).toBeCloseTo(0.2, 12);
		expect(p[1]).toBeCloseTo(0.3, 12);
		expect(p[2]).toBeCloseTo(0.5, 12);
	});

	it("clamps negative and non-finite weights to zero", () => {
		expect(normalize([-5, 1, 3])).toEqual([0, 0.25, 0.75]);
		expect(normalize([Number.NaN, 1, 1])).toEqual([0, 0.5, 0.5]);
		expect(normalize([Number.POSITIVE_INFINITY, 1, 1])).toEqual([0, 0.5, 0.5]);
	});

	it("falls back to uniform when there is no positive mass", () => {
		expect(normalize([0, 0, 0, 0])).toEqual([0.25, 0.25, 0.25, 0.25]);
		expect(normalize([-1, -2])).toEqual([0.5, 0.5]);
	});
});

describe("surprise", () => {
	it("gives 1 bit for a fair coin flip and 0 bits for a certainty", () => {
		expect(surprise(0.5)).toBeCloseTo(1, 12);
		expect(surprise(1)).toBeCloseTo(0, 12);
	});

	it("scales logarithmically: p = 1/256 is 8 bits", () => {
		expect(surprise(1 / 256)).toBeCloseTo(8, 12);
		expect(surprise(1 / 6)).toBeCloseTo(Math.log2(6), 12);
	});

	it("is infinite for an impossible event", () => {
		expect(surprise(0)).toBe(Number.POSITIVE_INFINITY);
	});

	it("is monotonically decreasing in p — rarer is more surprising", () => {
		expect(surprise(0.1)).toBeGreaterThan(surprise(0.2));
		expect(surprise(0.2)).toBeGreaterThan(surprise(0.9));
	});

	it("honors the log base", () => {
		expect(surprise(0.5, NATS)).toBeCloseTo(LN2, 12);
		expect(surprise(0.01, 10)).toBeCloseTo(2, 12);
	});
});

describe("entropy", () => {
	it("is 1 bit for a fair coin", () => {
		expect(entropy([0.5, 0.5])).toBeCloseTo(1, 12);
	});

	it("is 0 for a deterministic outcome (0·log0 = 0, not NaN)", () => {
		expect(entropy([1, 0])).toBeCloseTo(0, 12);
		expect(entropy([0, 0, 1, 0])).toBeCloseTo(0, 12);
		expect(Number.isNaN(entropy([1, 0]))).toBe(false);
	});

	it("is log2(n) for a uniform distribution", () => {
		expect(entropy([0.25, 0.25, 0.25, 0.25])).toBeCloseTo(2, 12);
		expect(entropy(new Array(8).fill(1 / 8))).toBeCloseTo(3, 12);
		expect(entropy(new Array(6).fill(1 / 6))).toBeCloseTo(Math.log2(6), 12);
	});

	it("is maximized by the uniform distribution", () => {
		const uniform = entropy([0.25, 0.25, 0.25, 0.25]);
		const skewed = [
			[0.7, 0.1, 0.1, 0.1],
			[0.4, 0.3, 0.2, 0.1],
			[0.97, 0.01, 0.01, 0.01],
			[0.26, 0.25, 0.25, 0.24],
		];
		for (const p of skewed) {
			expect(entropy(p)).toBeLessThan(uniform);
		}
	});

	it("is never negative", () => {
		for (const p of [
			[1, 0],
			[0.5, 0.5],
			[0.99, 0.01],
			[0.2, 0.3, 0.5],
		]) {
			expect(entropy(p)).toBeGreaterThanOrEqual(0);
		}
	});

	it("is invariant to reordering the outcomes", () => {
		expect(entropy([0.1, 0.2, 0.7])).toBeCloseTo(entropy([0.7, 0.1, 0.2]), 12);
	});

	it("ignores zero-probability outcomes entirely", () => {
		expect(entropy([0.5, 0.5, 0, 0, 0])).toBeCloseTo(entropy([0.5, 0.5]), 12);
	});

	it("converts between bases by the expected factor", () => {
		const p = [0.2, 0.3, 0.5];
		expect(entropy(p, NATS)).toBeCloseTo(entropy(p, 2) * LN2, 12);
		expect(entropy(p, 10)).toBeCloseTo(entropy(p, 2) * Math.log10(2), 12);
	});

	it("of the empty distribution is 0", () => {
		expect(entropy([])).toBe(0);
	});
});

describe("binaryEntropy", () => {
	it("peaks at 1 bit for p = 0.5", () => {
		expect(binaryEntropy(0.5)).toBeCloseTo(1, 12);
		expect(binaryEntropy(0.4)).toBeLessThan(1);
		expect(binaryEntropy(0.6)).toBeLessThan(1);
	});

	it("is 0 at the deterministic endpoints", () => {
		expect(binaryEntropy(0)).toBeCloseTo(0, 12);
		expect(binaryEntropy(1)).toBeCloseTo(0, 12);
	});

	it("is symmetric about p = 0.5", () => {
		expect(binaryEntropy(0.2)).toBeCloseTo(binaryEntropy(0.8), 12);
		expect(binaryEntropy(0.05)).toBeCloseTo(binaryEntropy(0.95), 12);
	});

	it("matches the closed form at p = 0.25", () => {
		// -0.25 log2 0.25 - 0.75 log2 0.75 = 0.5 + 0.75*log2(4/3)
		expect(binaryEntropy(0.25)).toBeCloseTo(0.5 + 0.75 * Math.log2(4 / 3), 12);
		expect(binaryEntropy(0.25)).toBeCloseTo(0.8112781244591328, 12);
	});
});

describe("crossEntropy", () => {
	it("equals the entropy of p when q === p", () => {
		const p = [0.2, 0.3, 0.5];
		expect(crossEntropy(p, p)).toBeCloseTo(entropy(p), 12);
	});

	it("is >= H(p) for any other q (Gibbs' inequality)", () => {
		const p = [0.2, 0.3, 0.5];
		for (const q of [
			[0.5, 0.3, 0.2],
			[1 / 3, 1 / 3, 1 / 3],
			[0.1, 0.1, 0.8],
		]) {
			expect(crossEntropy(p, q)).toBeGreaterThan(entropy(p));
		}
	});

	it("decomposes as H(p) + KL(p||q)", () => {
		const p = [0.1, 0.6, 0.3];
		const q = [0.25, 0.25, 0.5];
		expect(crossEntropy(p, q)).toBeCloseTo(entropy(p) + klDivergence(p, q), 12);
	});

	it("is infinite when q assigns zero mass to a possible outcome", () => {
		expect(crossEntropy([0.5, 0.5], [1, 0])).toBe(Number.POSITIVE_INFINITY);
	});

	it("is finite when p assigns zero mass where q does", () => {
		// p_i = 0 contributes nothing, so q_i = 0 there is harmless.
		expect(crossEntropy([1, 0], [0.5, 0])).toBeCloseTo(1, 12);
	});

	it("is asymmetric in general", () => {
		const p = [0.9, 0.1];
		const q = [0.5, 0.5];
		expect(crossEntropy(p, q)).not.toBeCloseTo(crossEntropy(q, p), 6);
	});
});

describe("klDivergence", () => {
	it("is exactly 0 when p === q", () => {
		for (const p of [
			[0.5, 0.5],
			[0.2, 0.3, 0.5],
			[1, 0],
			[0.25, 0.25, 0.25, 0.25],
		]) {
			expect(klDivergence(p, p)).toBeCloseTo(0, 12);
		}
	});

	it("is non-negative for many p/q pairs", () => {
		const dists = [
			[0.5, 0.5],
			[0.9, 0.1],
			[0.01, 0.99],
			[0.3, 0.7],
		];
		for (const p of dists) {
			for (const q of dists) {
				expect(klDivergence(p, q)).toBeGreaterThanOrEqual(0);
			}
		}
	});

	it("is asymmetric — D(p||q) !== D(q||p)", () => {
		const p = [0.9, 0.1];
		const q = [0.5, 0.5];
		expect(klDivergence(p, q)).not.toBeCloseTo(klDivergence(q, p), 6);
	});

	it("is infinite where q_i = 0 < p_i", () => {
		expect(klDivergence([0.5, 0.5], [1, 0])).toBe(Number.POSITIVE_INFINITY);
	});

	it("is finite in the reverse direction of that same pair", () => {
		expect(klDivergence([1, 0], [0.5, 0.5])).toBeCloseTo(1, 12);
	});

	it("grows as q moves away from p", () => {
		const p = [0.5, 0.5];
		expect(klDivergence(p, [0.6, 0.4])).toBeLessThan(klDivergence(p, [0.8, 0.2]));
		expect(klDivergence(p, [0.8, 0.2])).toBeLessThan(klDivergence(p, [0.95, 0.05]));
	});

	it("equals log2(n) from uniform to a point mass", () => {
		expect(klDivergence([1, 0, 0, 0], new Array(4).fill(0.25))).toBeCloseTo(2, 12);
	});
});

describe("maxEntropy", () => {
	it("is log_b(n)", () => {
		expect(maxEntropy(2)).toBeCloseTo(1, 12);
		expect(maxEntropy(8)).toBeCloseTo(3, 12);
		expect(maxEntropy(6)).toBeCloseTo(Math.log2(6), 12);
		expect(maxEntropy(100, 10)).toBeCloseTo(2, 12);
	});

	it("is 0 for a single outcome, and bounds actual entropies", () => {
		expect(maxEntropy(1)).toBeCloseTo(0, 12);
		expect(entropy([0.2, 0.3, 0.5])).toBeLessThanOrEqual(maxEntropy(3));
	});
});

describe("perplexity", () => {
	it("is the effective number of equally-likely choices", () => {
		expect(perplexity([0.5, 0.5])).toBeCloseTo(2, 12);
		expect(perplexity(new Array(6).fill(1 / 6))).toBeCloseTo(6, 12);
	});

	it("is 1 for a deterministic distribution", () => {
		expect(perplexity([1, 0, 0])).toBeCloseTo(1, 12);
	});

	it("is base^entropy and never exceeds the outcome count", () => {
		const p = [0.1, 0.2, 0.3, 0.4];
		expect(perplexity(p)).toBeCloseTo(2 ** entropy(p), 12);
		expect(perplexity(p)).toBeLessThan(4);
	});

	it("agrees across bases", () => {
		const p = [0.1, 0.2, 0.7];
		expect(perplexity(p, NATS)).toBeCloseTo(perplexity(p, 2), 10);
	});
});

describe("marginals", () => {
	it("sums rows into px and columns into py", () => {
		const joint = [
			[0.1, 0.2],
			[0.3, 0.4],
		];
		const { px, py } = marginals(joint);
		expect(px[0]).toBeCloseTo(0.3, 12);
		expect(px[1]).toBeCloseTo(0.7, 12);
		expect(py[0]).toBeCloseTo(0.4, 12);
		expect(py[1]).toBeCloseTo(0.6, 12);
	});

	it("recovers the factors of an independent joint", () => {
		const { px, py } = marginals(independentJoint([0.3, 0.7], [0.2, 0.5, 0.3]));
		expect(px[0]).toBeCloseTo(0.3, 12);
		expect(px[1]).toBeCloseTo(0.7, 12);
		expect(py[0]).toBeCloseTo(0.2, 12);
		expect(py[1]).toBeCloseTo(0.5, 12);
		expect(py[2]).toBeCloseTo(0.3, 12);
	});

	it("handles an empty joint without throwing", () => {
		expect(marginals([])).toEqual({ px: [], py: [] });
	});
});

describe("jointEntropy", () => {
	it("equals H(X) + H(Y) when X and Y are independent", () => {
		const px = [0.3, 0.7];
		const py = [0.2, 0.5, 0.3];
		expect(jointEntropy(independentJoint(px, py))).toBeCloseTo(entropy(px) + entropy(py), 12);
	});

	it("equals H(X) when Y is a deterministic copy of X", () => {
		const joint = [
			[0.5, 0],
			[0, 0.5],
		];
		expect(jointEntropy(joint)).toBeCloseTo(1, 12);
	});

	it("is the entropy of the flattened joint", () => {
		const joint = [
			[0.1, 0.2],
			[0.3, 0.4],
		];
		expect(jointEntropy(joint)).toBeCloseTo(entropy([0.1, 0.2, 0.3, 0.4]), 12);
	});
});

describe("mutualInformation", () => {
	it("is 0 for independent variables", () => {
		expect(mutualInformation(independentJoint([0.3, 0.7], [0.2, 0.5, 0.3]))).toBeCloseTo(0, 12);
		expect(mutualInformation(independentJoint([0.5, 0.5], [0.5, 0.5]))).toBeCloseTo(0, 12);
		expect(mutualInformation(independentJoint([0.25, 0.25, 0.5], [0.1, 0.9]))).toBeCloseTo(0, 12);
	});

	it("is 1 bit when Y is a perfect copy of a fair binary X", () => {
		expect(
			mutualInformation([
				[0.5, 0],
				[0, 0.5],
			]),
		).toBeCloseTo(1, 12);
	});

	it("is symmetric: I(X;Y) === I(Y;X)", () => {
		const joints = [
			[
				[0.1, 0.2],
				[0.3, 0.4],
			],
			[
				[0.4, 0.1, 0.05],
				[0.05, 0.3, 0.1],
			],
			independentJoint([0.3, 0.7], [0.6, 0.4]),
		];
		for (const joint of joints) {
			expect(mutualInformation(joint)).toBeCloseTo(mutualInformation(transpose(joint)), 12);
		}
	});

	it("satisfies I(X;Y) = H(X) + H(Y) - H(X,Y)", () => {
		const joints = [
			[
				[0.1, 0.2],
				[0.3, 0.4],
			],
			[
				[0.4, 0.1, 0.05],
				[0.05, 0.3, 0.1],
			],
			[
				[0.5, 0],
				[0, 0.5],
			],
		];
		for (const joint of joints) {
			const { px, py } = marginals(joint);
			expect(mutualInformation(joint)).toBeCloseTo(
				entropy(px) + entropy(py) - jointEntropy(joint),
				10,
			);
		}
	});

	it("is never negative, even for near-independent joints with float error", () => {
		expect(
			mutualInformation(independentJoint([1 / 3, 1 / 3, 1 / 3], [0.7, 0.3])),
		).toBeGreaterThanOrEqual(0);
		expect(mutualInformation([[1]])).toBeGreaterThanOrEqual(0);
	});

	it("is bounded above by min(H(X), H(Y))", () => {
		const joint = [
			[0.4, 0.1, 0.05],
			[0.05, 0.3, 0.1],
		];
		const { px, py } = marginals(joint);
		expect(mutualInformation(joint)).toBeLessThanOrEqual(
			Math.min(entropy(px), entropy(py)) + 1e-12,
		);
	});

	it("tolerates zero cells without producing NaN", () => {
		const mi = mutualInformation([
			[0.5, 0],
			[0.25, 0.25],
		]);
		expect(Number.isNaN(mi)).toBe(false);
		expect(mi).toBeGreaterThan(0);
	});
});

describe("redistribute", () => {
	it("sets the target entry and keeps the distribution summing to 1", () => {
		const out = redistribute([0.25, 0.25, 0.25, 0.25], 0, 0.4);
		expect(out[0]).toBeCloseTo(0.4, 12);
		expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
		for (let i = 1; i < out.length; i++) expect(out[i]).toBeCloseTo(0.2, 12);
	});

	it("preserves the relative proportions of the untouched entries", () => {
		const out = redistribute([0.2, 0.2, 0.6], 0, 0.5);
		expect(out[0]).toBeCloseTo(0.5, 12);
		expect(out[2] / out[1]).toBeCloseTo(3, 12);
		expect(out.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
	});

	it("clamps p into [0, 0.999]", () => {
		expect(redistribute([0.5, 0.5], 0, 5)[0]).toBeCloseTo(0.999, 12);
		expect(redistribute([0.5, 0.5], 0, -5)[0]).toBeCloseTo(0, 12);
		// clamping below 1 keeps entropy strictly positive rather than degenerate
		expect(entropy(redistribute([0.5, 0.5], 0, 1))).toBeGreaterThan(0);
	});

	it("spreads the remainder uniformly when the other entries are all zero", () => {
		const out = redistribute([1, 0, 0, 0], 0, 0.4);
		expect(out[0]).toBeCloseTo(0.4, 12);
		expect(out[1]).toBeCloseTo(0.2, 12);
		expect(out[2]).toBeCloseTo(0.2, 12);
		expect(out[3]).toBeCloseTo(0.2, 12);
	});

	it("does not mutate its input", () => {
		const input = [0.25, 0.25, 0.5];
		redistribute(input, 1, 0.9);
		expect(input).toEqual([0.25, 0.25, 0.5]);
	});
});

describe("maxEntByMean", () => {
	const faces = [1, 2, 3, 4, 5, 6];

	it("returns the uniform distribution when the target is the unconstrained mean", () => {
		const { probs, lambda, entropy: h } = maxEntByMean(faces, 3.5);
		for (const p of probs) expect(p).toBeCloseTo(1 / 6, 6);
		expect(lambda).toBeCloseTo(0, 6);
		expect(h).toBeCloseTo(Math.log2(6), 6);
	});

	it("hits the requested mean", () => {
		for (const target of [2, 2.5, 3.5, 4.5, 5]) {
			expect(maxEntByMean(faces, target).achievedMean).toBeCloseTo(target, 6);
		}
	});

	it("produces a valid probability distribution", () => {
		const { probs } = maxEntByMean(faces, 2);
		expect(probs).toHaveLength(6);
		expect(probs.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
		for (const p of probs) expect(p).toBeGreaterThan(0);
	});

	it("tilts negatively below the mean and positively above it", () => {
		expect(maxEntByMean(faces, 2).lambda).toBeLessThan(0);
		expect(maxEntByMean(faces, 5).lambda).toBeGreaterThan(0);
	});

	it("is the Boltzmann/Gibbs form p_i ∝ exp(λ x_i)", () => {
		const { probs, lambda } = maxEntByMean(faces, 4.5);
		for (let i = 1; i < faces.length; i++) {
			expect(probs[i] / probs[i - 1]).toBeCloseTo(Math.exp(lambda * (faces[i] - faces[i - 1])), 8);
		}
	});

	it("is monotonically decreasing in probability as the mean is pulled down", () => {
		const { probs } = maxEntByMean(faces, 2);
		for (let i = 1; i < probs.length; i++) expect(probs[i]).toBeLessThan(probs[i - 1]);
	});

	it("has entropy at or below the unconstrained maximum", () => {
		for (const target of [1.5, 2, 3.5, 5, 5.5]) {
			expect(maxEntByMean(faces, target).entropy).toBeLessThanOrEqual(Math.log2(6) + 1e-9);
		}
		// a constrained mean is strictly less entropic than uniform
		expect(maxEntByMean(faces, 2).entropy).toBeLessThan(maxEntByMean(faces, 3.5).entropy);
	});

	it("clamps targets outside the support instead of diverging", () => {
		const low = maxEntByMean(faces, -100);
		expect(Number.isFinite(low.entropy)).toBe(true);
		expect(low.achievedMean).toBeGreaterThanOrEqual(1);
		const high = maxEntByMean(faces, 100);
		expect(Number.isFinite(high.entropy)).toBe(true);
		expect(high.achievedMean).toBeLessThanOrEqual(6);
	});

	it("reports entropy in the requested base", () => {
		expect(maxEntByMean(faces, 2.5, NATS).entropy).toBeCloseTo(
			maxEntByMean(faces, 2.5, 2).entropy * LN2,
			6,
		);
	});
});

describe("fmt", () => {
	it("renders the infinities as symbols", () => {
		expect(fmt(Number.POSITIVE_INFINITY)).toBe("∞");
		expect(fmt(Number.NEGATIVE_INFINITY)).toBe("−∞");
	});

	it("trims trailing float noise after the decimal point", () => {
		expect(fmt(1.5)).toBe("1.5");
		expect(fmt(2)).toBe("2");
		expect(fmt(0)).toBe("0");
		expect(fmt(0.25, 2)).toBe("0.25");
		expect(fmt(1 / 3)).toBe("0.333");
	});

	it("rounds to the requested number of digits", () => {
		expect(fmt(Math.log2(6), 3)).toBe("2.585");
		expect(fmt(Math.log2(6), 1)).toBe("2.6");
	});

	it("keeps whole numbers intact at the default precision", () => {
		expect(fmt(100)).toBe("100");
		expect(fmt(1000)).toBe("1000");
		expect(fmt(20, 2)).toBe("20");
	});

	// ── KNOWN BUG — characterization tests, NOT desired behavior ──────────
	//
	// fmt() strips trailing zeros with /\.?0+$/, where the decimal point is
	// OPTIONAL. At digits >= 1 the point is always present so the regex is
	// anchored correctly, but at digits = 0 toFixed() emits no decimal point
	// and the regex happily eats the number's own trailing zeros.
	//
	// This is live in the UI: app/information-theory/entropy/page.tsx and
	// app/information-theory/max-entropy/page.tsx both render
	//   `fraction of maximum entropy: {fmt((h / hMax) * 100, 0)}%`
	// so a true 100% displays as "1%" and 50% displays as "5%".
	//
	// The fix is to only strip zeros when a "." is present, e.g.
	//   .replace(/\.\d*?0+$/, (m) => m.replace(/0+$/, "")).replace(/\.$/, "")
	// Left unfixed here deliberately: this PR is tests-only, and the bug is
	// reported rather than silently patched. These assertions pin the current
	// behavior so the fix shows up as a deliberate, reviewable test change.
	it("BUG: mangles whole numbers when digits = 0 (should be '100', '50', '20')", () => {
		expect(fmt(100, 0)).toBe("1");
		expect(fmt(50, 0)).toBe("5");
		expect(fmt(20, 0)).toBe("2");
		expect(fmt(1000, 0)).toBe("1");
	});

	it("digits = 0 is correct only when the value has no trailing zero", () => {
		expect(fmt(7, 0)).toBe("7");
		expect(fmt(42, 0)).toBe("42");
		expect(fmt(2.6, 0)).toBe("3");
	});
});
