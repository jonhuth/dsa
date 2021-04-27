from Graphs.Graph import Graph


class DepthFirstPaths:
    def __init__(self, G, s):
        self.visited = [False] * G.V  # visited list of nodes
        self.edge_to = [] * G.V  # edge_to[v] => prev vertex on path from s to v
        self.s = s  # source node

    def dfs(self, G, v):
        '''
        recursive dfs from node v.
        '''
        self.visited[v] = True
        for w in G.adj():
            if not self.visited[w]:
                self.dfs(G, w)
                self.edge_to[w] = v

    def has_path_to(self, v: int) -> bool:
        '''
        check if node v has a path to it.
        '''
        return self.visited[v]

    def path_to(self, v: int) -> list:
        '''
        return path to node v as a stack (represented as array)
        '''
        if not self.has_path_to(v):
            return None
        path = []
        x = v
        while x != self.s:
            path.push(x)
            x = self.edge_to[x]
        path.push(self.s)
        return path
