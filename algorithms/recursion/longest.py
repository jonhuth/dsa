def longest(words, best='', i=0):
    '''
    find the longest word in words using recursion.

    >>> longest(['happy', 'strong', 'fast'])
    'strong'
    >>> longest(['happy', 'crash', 'stars'])
    'happy'
    '''
    if i == len(words):
        return best
    curr_word = words[i]
    best = curr_word if len(curr_word) > len(best) else best
    return longest(words, best, i+1)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
