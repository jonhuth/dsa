class Digraph:
    '''
    Implementation of Directed Graph.
    '''

    def __init__(self, V=0):
        self.V = V
        # nodes : 0, 1, 2, 3, ..., V-1
        # adj list of form: idx: list of edges (v -> [w, x, y, ...])
        self.adj = [[] for _ in range(V)]

    def add_edge(self, v: int, w: int):
        '''
        add edge between node v and w (v -> w)
        time: O(1) | space: O(1)
        '''
        self.adj[v].append(w)

    def get_adj(self, v):
        '''
        vertices adjacent to v
        '''
        return self.adj[v]

    def get_V(self):
        '''
        num vertices in Bigraph
        '''
        return self.V


G = Digraph(4)
G.add_edge(0, 2)
# print(G.get_adj(0))
# print(G.get_V(), G.adj)
