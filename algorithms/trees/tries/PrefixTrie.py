class Trie:

    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.tree = {}
        self.words = {}  #form: word -> True

    def insert(self, word: str) -> None:
        """
        Inserts a word into the trie.
        """
        self.words[word] = True
        layer = self.tree
        for ltr in word:
            if ltr not in layer:
                layer[ltr] = {}
            layer = layer[ltr]  # go to next layer

    def search(self, word: str) -> bool:
        """
        Returns if the word is in the trie.
        """
        return self.words.get(word, False)

    def startsWith(self, prefix: str) -> bool:
        """
        Returns if there is any word in the trie that starts with the given prefix.
        """
        # if prefix in self.words:
        #     return True
        layer = self.tree
        for ltr in prefix:
            if ltr not in layer:
                return False
            layer = layer[ltr]
        return True


# Your Trie object will be instantiated and called as such:
# obj = Trie()
# obj.insert(word)
# param_2 = obj.search(word)
# param_3 = obj.startsWith(prefix)


t = Trie()
t.insert('apple')
t.startsWith('app')
t.search('app')
