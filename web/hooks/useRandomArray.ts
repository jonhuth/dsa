export function useRandomArray(minSize = 5, maxSize = 8, min = 1, max = 90) {
	const randomize = () => {
		const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
		return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
	};
	return { randomize };
}
