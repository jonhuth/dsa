def removePalindromeSub(s: str) -> int:
    '''
    key takeaways:
    1. remember, we can remove subsequences, not just substrings
    2. know the difference between subsequence and substring
    3. substring is a contiguous block of chars in a string s
    4. subsequence can be any group of chars in correct order in the string s
    5. if there are only 2 chars, worst case is we take subsequence of a's and same for b's
    time: O(n) | space: O(1) where n is num of chars in s
    '''
    return 1 if isPalindrome(s) else 2


def isPalindrome(s):
    i, j = 0, len(s) - 1
    while i <= j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True
