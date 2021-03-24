class QuickFindUF:
    '''
    quick find implementation of union find algorithm
    flaw: union method too slow => O(n^2) time to process n union commands
    '''

    def __init__(self, N):
        '''
        initial arr data structure representing N objects
        time: O(n) | space: O(n)
        '''
        self.N = N
        self.id = [i for i in range(N)]

    def connected(self, p, q):
        '''
        check whether p and q are in the same component
        time: O(1) | space: O(1)
        '''
        return self.id[p] == self.id[q]

    def union(self, p, q):
        '''
        connect objects p and q (combine into same connected component)
        time: O(n) | space: O(1)
        '''
        pid, qid = self.id[p], self.id[q]
        for i in range(self.N):
            if self.id[i] == pid:
                self.id[i] = qid
