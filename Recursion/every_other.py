def every_other(s, start_idx=0):
    '''
    return a string with every other letter from the input string.

    >>> every_other('haha')
    'hh'
    >>> every_other('interesting')
    'itrsig'
    >>> every_other('interesting', 1)
    'neetn'
    '''
    out = []

    def _recurse(s, i=start_idx):
        if i < len(s):
            out.append(s[i])
            _recurse(s, i+2)

    _recurse(s)
    return ''.join(out)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
