class QuickUnionUF:
    '''
    quick union implementation of union find algorithm
    improvements:
    1. weighted quick union (WQU)
    2. path compression
    flaws: tress can get tall and find too expensive
    '''

    def __init__(self, N):
        '''
        initial arr data structure representing N objects
        time: O(n) | space: O(n)
        '''
        self.N = N
        self.id = [i for i in range(N)]
        # keep track of size of tree rooted at i
        self.sz = [1 for _ in range(N)]

    def root(self, i):
        '''
        helper method to determine root of component i
        time: O(logn) | space: O(1)
        '''
        while i != self.id[i]:
            # path compression: each node points to grandparent
            self.id[i] = self.id[self.id[i]]
            i = self.id[i]
        return i

    def connected(self, p, q):
        '''
        check whether p and q are in the same component
        time: O(logn) | space: O(1)
        '''
        return self.root(p) == self.root(q)

    def union(self, p, q):
        '''
        connect objects p and q (combine into same connected component)
        link root of smaller tree to root of larger tree
        time: O(logn) | space: O(1)
        '''
        pRoot, qRoot = self.root(p), self.root(q)
        if pRoot == qRoot:
            return
        # is tree rooted at pRoot smaller than that of qRoot
        if self.sz[pRoot] < self.sz[qRoot]:
            self.id[pRoot] = qRoot
            self.sz[qRoot] += self.sz[pRoot]
        else:
            self.id[qRoot] = pRoot
            self.sz[pRoot] += self.sz[qRoot]
