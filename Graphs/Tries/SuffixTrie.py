class SuffixTrie:
    def __init__(self, string):
        self.root = {}
        self.endSymbol = "*"
        self.populateSuffixTrieFrom(string)

    def populateSuffixTrieFrom(self, string):
        # time: O(n^2) | space: O(n^2) where n is len of string
        # n suffixes for len n string
        # babc
        for i in range(len(string)):
            currentNode = self.root
            for j in range(i, len(string)):
                if string[j] not in currentNode:  # don't need to add at this level
                    currentNode[string[j]] = {}
                currentNode = currentNode[string[j]]
            currentNode[self.endSymbol] = True

    def contains(self, string):
        # time: O(n) | space: O(1)
        currentNode = self.root
        for char in string:
            if char not in currentNode:
                return False
            currentNode = currentNode[char]
        return self.endSymbol in currentNode
