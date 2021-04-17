def is_palindrome(s, i=0):
    '''
    return whether input string is palindrome or not.

    >>> is_palindrome('')
    True
    >>> is_palindrome('a')
    True
    >>> is_palindrome('haah')
    True
    >>> is_palindrome('mapam')
    True
    >>> is_palindrome('interesting')
    False
    >>> is_palindrome('nonce')
    False

    >>> is_palindrome('noon')
    True

    time: O(n) | space: O(n)
    '''
    if i == len(s)//2:  # base case 0: s[i] == s[-i - 1] for all i
        return True
    if s[i] != s[-(i+1)]:  # base case 1: break early
        return False
    return is_palindrome(s, i + 1)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
