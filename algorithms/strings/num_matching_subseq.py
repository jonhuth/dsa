def numMatchingSubseq(s: str, words: list[str]) -> int:
    '''
    given a string s and an array of strings words, return the number of words[i] that is a subsequence of s.

    a subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without chaning the relative order of the remaining characters.

    ex. 'ace' is a subsequence of 'abcde' by stripping out the b and d, the strings match

    time: O(m + n*k) | space: O(n) - m = len(s), n = num strings, k = max len of a string
    '''
    ans = 0
    heads = [[] for _ in range(26)]
    for word in words:
        it = iter(word)
        heads[ord(next(it)) - ord('a')].append(it)

    for ltr in s:
        ltr_idx = ord(ltr) - ord('a')
        old_bucket = heads[ltr_idx]
        heads[ltr_idx] = []

        while old_bucket:
            it = old_bucket.pop()
            nxt = next(it, None)
            if nxt:
                heads[ord(nxt) - ord('a')].append(it)
            else:
                ans += 1

    return ans
