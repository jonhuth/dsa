from math import sqrt


def numFactoredBinaryTrees(arr):
    '''
        key points:
        1. each unique val in arr can be the root of at least 1 tree

        dp solution
        v = root
        x = left child, y = right child where x*y == v
        => there dp(x) * dp(y) to make trees with v as root
        sum all these up across dp arr and that is answer

        time: O(n^(3/2)) | space: O(n)
        '''
    MOD = 10**9 + 7
    arr.sort()
    waysMap = {x: 1 for x in arr}

    for i, x in enumerate(arr):
        for j in range(i):
            left = arr[j]
            if left > sqrt(x):
                break
            if x % left == 0:
                right = x / left
                if right in waysMap:
                    perfSqr = 1 if left == right else 2
                    waysMap[x] += waysMap[left] * waysMap[right] * perfSqr
                    waysMap[x] %= MOD

    return sum(waysMap.values()) % MOD
