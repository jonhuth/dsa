def groupAnagrams(words):
    '''
    time: O(w*n*log(n)) | space: O(w*n) w=num of words and n= longest word len
    ex: [yo, act, flop, tac, foo, cat, oy, olfp] =>
    [oy, act, flop, act, foo, act, oy, flop]
    {'oy': ['yo', 'oy'], 'act': ['act', 'cat'], 'flop': ['flop', 'olfp'],
     'foo': ['foo'] }
    => [['yo', 'oy'], ['act', 'cat'], ['flop', 'olfp'], ['foo']]
    '''
    wordsSorted = [''.join(sorted(word)) for word in words]
    wordsDict = {}  # k: v => sortedWord: [assocWord0, assocWord1, ...]
    for i, word in enumerate(wordsSorted):
        wordsDict[word] = wordsDict.get(word, []) + [words[i]]
    return list(wordsDict.values())
