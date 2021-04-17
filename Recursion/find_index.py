def find_index(s, c, i=0):
    '''
    find idx of char in input string.
    return index of first instance otherwise,
    return -1 if cannot find.

    >>> find_index('', 'a')
    -1
    >>> find_index('a', 'a')
    0
    >>> find_index('haah', 'b')
    -1
    >>> find_index('this is a string', ' ')
    4

    time: O(n) | space: O(n)
    '''
    if i == len(s):
        return -1
    if s[i] == c:
        return i
    return find_index(s, c, i + 1)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
