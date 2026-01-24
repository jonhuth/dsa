def hasAllCodes(self, s: str, k: int) -> bool:
    # time: O(n*k) | space: O(n*k)
    kPermSet = set([])

    for i in range(len(s) - k + 1):
        kPermSet.add(s[i:i+k])

    return len(kPermSet) == 2**k
