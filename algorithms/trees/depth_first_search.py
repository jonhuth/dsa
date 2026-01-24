class Node:
    def __init__(self, name):
        self.children = []
        self.name = name

    def addChild(self, name):
        self.children.append(Node(name))
        return self

    def depthFirstSearch(self, array):
        # time: O(v + e) - loop through all vertices and for each vertex,
        # loop through children (# of edges - e)
        # space: O(v) - output array is linearly related to # of nodes
        array.append(self.name)
        for child in self.children:
            child.depthFirstSearch(array)
        return array
