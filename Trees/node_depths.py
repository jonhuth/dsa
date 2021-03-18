# time: O(n) | space: O(h) where n is the num of nodes in the tree and h is the height of the tree
# it is h for worst case space complexity instead of n because
# there are at most h calls on the call stack at one time

def nodeDepths(root, currDepth=0):
    if root is None:
        return 0
    leftDepth = nodeDepths(root.left, currDepth + 1)
    rightDepth = nodeDepths(root.right, currDepth + 1)
    print(currDepth + leftDepth + rightDepth)
    return currDepth + leftDepth + rightDepth


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
