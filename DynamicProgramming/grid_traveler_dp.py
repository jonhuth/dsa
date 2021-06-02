def gridTravelerDP(m, n, memo={}):
    # time: O(m*n) | space: O(m + n)
    # note: gt(m,n) == gt(n, m) as rows and cols can be swapped -- paths symmetric about diagonal
    if (m, n) in memo or (n, m) in memo:
        return memo[(m, n)]
    if m <= 1 or n <= 1:
        return min(m, n)
    memo[(m, n)] = gridTravelerDP(m - 1, n, memo) + \
        gridTravelerDP(m, n - 1, memo)
    memo[(n, m)] = memo[(m, n)]
    return memo[(m, n)]
