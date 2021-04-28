def invert_binary_tree(root):
    # time: O(n) | space: O(h) where n is num nodes
    # and h = logn (height of tree)
    if root is None:
        return
    # evaluate left and right children first, then swap
    invert_binary_tree(root.left)
    invert_binary_tree(root.right)
    root.left, root.right = root.right, root.left
    return root


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
