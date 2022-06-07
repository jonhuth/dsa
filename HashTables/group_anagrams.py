from collections import defaultdict
def groupAnagrams(words):
    '''
    time: O(w*n*log(n)) | space: O(w) w=num of words and n= longest word len
    ex: [yo, act, flop, tac, foo, cat, oy, olfp] =>
    [oy, act, flop, act, foo, act, oy, flop]
    {'oy': ['yo', 'oy'], 'act': ['act', 'cat'], 'flop': ['flop', 'olfp'],
     'foo': ['foo'] }
    => [['yo', 'oy'], ['act', 'cat'], ['flop', 'olfp'], ['foo']]
    '''
    wordsDict = defaultdict(list)  # k: v => sortedWord: [assocWord0, assocWord1, ...]
    for word in words:
        sortedWord = str(sorted(word))
        wordsDict[sortedWord].append(word)
    return wordsDict.values()
