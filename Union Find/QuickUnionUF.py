class QuickUnionUF:
    '''
    quick union implementation of union find algorithm
    flaws: tress can get tall and find too expensive
    '''

    def __init__(self, N):
        '''
        initial arr data structure representing N objects
        time: O(n) | space: O(n)
        '''
        self.N = N
        self.id = [i for i in range(N)]

    def root(self, i):
        '''
        helper method to determine root of component i
        time: O(n) | space: O(1)
        '''
        while i != self.id[i]:
            i = self.id[i]
        return i

    def connected(self, p, q):
        '''
        check whether p and q are in the same component
        time: O(n) | space: O(1)
        '''
        return self.root(p) == self.root(q)

    def union(self, p, q):
        '''
        connect objects p and q (combine into same connected component)
        time: O(n) | space: O(1)
        '''
        pRoot, qRoot = self.root(p), self.root(q)
        self.id[pRoot] = qRoot
