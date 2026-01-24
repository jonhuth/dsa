# Do not edit the class below except
# for the breadthFirstSearch method.
# Feel free to add new properties
# and methods to the class.
from collections import deque
class Node:
    def __init__(self, name):
        self.children = []
        self.name = name

    def addChild(self, name):
        self.children.append(Node(name))
        return self

    def breadthFirstSearch(self, array):
		# O(v + e) T | O(v) S where v is the number of vertices and e is the number of edges in the tree
		# worse case our queue might have v - 1 children in it
        toVisit = deque([self])
		
        while toVisit: # while toVisit is not empty
            node = toVisit.popleft()
            array.append(node.name)
            for child in node.children:
                toVisit.append(child)
        return array
