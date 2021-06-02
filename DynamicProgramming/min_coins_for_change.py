def minNumberOfCoinsForChange(n, denoms):
    # O(n*d) T | O(n) S
    # i goes through: [0, n]
    zero_to_n = [0] + [float('inf')]*n

    for denom in denoms:
        for i in range(1, len(zero_to_n)):
            if denom <= i:
                zero_to_n[i] = min(zero_to_n[i - denom] + 1, zero_to_n[i])

    return zero_to_n[-1] if zero_to_n[-1] != float('inf') else -1
