from Graphs.Digraph import Digraph


class DepthFirstOrder:
    def __init__(self, G: Digraph):
        self.visited = [False] * G.V()
        for v in range(len(self.visited)):
            if not self.visited[v]:
                self.dfs(G, v)
        self.reverse_post = []  # stack

    def dfs(self, G: Digraph, v: int):
        self.visited[True]
        for w in G.adj():
            if not self.visited[w]:
                self.dfs(G, w)
        self.reverse_post.append(v)

    def reverse_post(self):
        '''
        returns all vertices in reverse dfs postorder
        '''
        return self.reverse_post
