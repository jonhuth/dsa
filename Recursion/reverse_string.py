def reverse_string(s):
    '''
    reverse input string.

    >>> reverse_string('')
    ''
    >>> reverse_string(' ')
    ' '
    >>> reverse_string('hi')
    'ih'
    >>> reverse_string('hello world!')
    '!dlrow olleh'

    time: O(n) | space: O(n)
    '''
    def _reverse_string(s, out=[], i=len(s)-1):
        if i < 0:
            return out
        out.append(s[i])
        return _reverse_string(s, out, i - 1)

    return ''.join(_reverse_string(s))


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
