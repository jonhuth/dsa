class Graph:
    '''
    Undirected Graph represented by adjacency list
    real world graphs tend to be sparse => best to use adj. list representation.
    '''

    def __init__(self, V=0):
        self.V = V
        # nodes : 0, 1, 2, 3, ..., V-1
        # adj list of form: idx: list of edges (v -> [w, x, y, ...])
        self.adj = [[]] * V

    def add_edge(self, v: int, w: int):
        '''
        add edge between node v and w (undirected graph)
        time: O(1) | space: O(1)
        '''
        self.adj[v].append(w)
        self.adj[w].append(v)

    def adj(self, v):
        '''
        vertices adjacent to v
        '''
        return self.adj[v]
