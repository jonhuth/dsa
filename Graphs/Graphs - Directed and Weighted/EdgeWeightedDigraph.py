import DirectedEdge


class EdgeWeightedDigraph:
    '''
    adjacency list representation of edge weighted digraph.

    representation: array of arrays of directed edge objects
    '''

    def __init__(self, V=0):
        self.V = V
        self.adj = [[] for _ in range(V)]

    def add_edge(self, e: DirectedEdge):
        '''
        add edge e: v -> w to only v's adj. list
        '''
        v = e.from()
        self.adj[v].append(e)

    def get_adj(self, v):
        '''
        get edges going out of node v.
        '''
        return self.adj[v]
