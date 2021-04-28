import Digraph


class DepthFirstOrder:
    '''
    reverse dfs postorder of a DAG is a topological order.
    '''

    def __init__(self, G: Digraph):
        self.visited = [False] * G.get_V()
        # for v in range(len(self.visited)):
        #     if not self.visited[v]:
        #         self.dfs(G, v)
        self.postorder = []  # stack

    def dfs(self, G: Digraph, v: int):
        self.visited[v] = True
        for w in G.get_adj(v):
            if not self.visited[w]:
                self.dfs(G, w)
        self.postorder.append(v)

    def post_order(self):
        '''
        returns all vertices in dfs postorder
        '''
        return self.postorder

    def topological_order(self):
        '''
        returns array of nodes in topological order (reverse dfs postorder)

        time: O(n) | space: O(n)
        '''
        return self.postorder[::-1]


G1 = Digraph.Digraph(4)
G1.add_edge(0, 3)
G1.add_edge(0, 1)
G1.add_edge(1, 2)
G1.add_edge(2, 3)
print(G1.adj)
DFO = DepthFirstOrder(G1)
DFO.dfs(G1, 0)
print(DFO.post_order())
print(DFO.topological_order())
