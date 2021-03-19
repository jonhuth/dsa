def numFactoredBinaryTrees(arr):
    '''
    key points:
    1. each unique val in arr can be the root of at least 1 tree

    dp solution
    v = root
    x = left child, y = right child where x*y == v
    => there dp(x) * dp(y) to make trees with v as root
    sum all these up across dp arr and that is answer

    time: O(n^2) | space: O(n)
    '''
    MOD = 10**9 + 7
    arr.sort()
    dp = [1] * len(arr)  # where dp[i] == num trees with arr[i] as root
    index = {x: i for i, x in enumerate(arr)}  # arr[i] => i

    for i, x in enumerate(arr):
        for j in range(i):
            if x % arr[j] == 0:
                right = x / arr[j]
                if right in index:
                    dp[i] += dp[j] * dp[index[right]]
                    dp[i] %= MOD

    return sum(dp) % MOD
