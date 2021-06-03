import Graph
from collections import deque


class BreadthFirstPaths:
    def __init__(self, G, s):
        self.visited = [False] * G.V  # visited list of nodes
        # edge_to[v] => prev vertex on path from s to v
        self.edge_to = [None] * G.V
        self.s = s  # source node

    def bfs(self, G, s):
        '''
        time: O(v+e) | space: O(v)
        '''
        q = deque([s])
        self.visited[s] = True
        while q:
            v = q.popleft()
            for w in G.adj(v):
                if not self.visited[w]:
                    q.append(w)
                    self.visited[w] = True
                    self.edge_to[w] = v
