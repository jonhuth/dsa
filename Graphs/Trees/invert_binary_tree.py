def invertBinaryTree(tree):
    # time: O(n) | space: O(d) where n is num nodes
    # and d is the height of the tree
    if tree is None:
        return
    else:
        # evaluate left and right children first, then swap 
        invertBinaryTree(tree.left)
        invertBinaryTree(tree.right)
        tree.left, tree.right = tree.right, tree.left
    return tree
	


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
