def reverseVowels(self, s: str) -> str:
    '''
    given a string consisting of only ascii characters, swap only the vowels.

    O(n) time | O(n) space - where n = len(s)
    '''
    l, r = 0, len(s) - 1
    out = list(s)
    vowels = 'aeiouAEIOU'

    while l < r:
        while s[l] not in vowels and l < r:
            l += 1

        while s[r] not in vowels and l < r:
            r -= 1
        if s[l] in vowels and s[r] in vowels:
            out[l], out[r] = out[r], out[l]
        l += 1
        r -= 1

    return ''.join(out)
