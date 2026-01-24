def gather_strings(d):
    '''
    given a hash table, return an array of all of the string values.
    note: the input hash table can be nested

    >>> gather_strings({})
    []
    >>> gather_strings({1: 'hi', 2: 'lo'})
    ['hi', 'lo']
    >>> gather_strings({1: {1: 'hi'}, 2: 'lo'})
    ['hi', 'lo']


    time: O(k*d) | space: O(k + d)
    where k = num outer keys
    & d = deepest nesting
    '''
    def _gather_strings(d, strs=[]):
        for key in d:
            if isinstance(d[key], dict):
                _gather_strings(d[key], strs)
            elif isinstance(d[key], str):
                strs.append(d[key])

        return strs

    return _gather_strings(d)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
