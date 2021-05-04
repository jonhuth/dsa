class TreeNode:
    def __init__(self, id, parent) -> None:
        self.id = id
        self.parent = parent
        self.children = []


def root_tree(g, root_id=0):
    '''
    given a graph/tree represented as an adjacency list with undirected edges.
    if theree's an edge between (u, v) => (v, u)
    root_id is the id of the node to root the tree from.
    '''
    def build_tree(g, node, parent):
        for child_id in g[node.id]:
            if parent is not None and child_id == parent.id:
                continue
            child = TreeNode(child_id, node, [])
            node.children.append(child)
            build_tree(g, child, node)
        return node
    root = TreeNode(root_id, None, [])
    return build_tree(g, root, None)
