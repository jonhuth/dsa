class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def binary_tree_diameter(root: TreeNode) -> int:
    '''
    prompt: Given the root of a binary tree, return the length of the diameter
    of the tree. The diameter of a binary tree is the length of the longest path
    between any two nodes in a tree. This path may or may not pass through the
    root.

    The length of a path between two nodes is represented by the number of edges
    between them.

    algorithm: track largest diameter thus far and traverse the tree updating
    diameter and bubbling up the max path along the way. The max path may not go
    through the root. The max path will definitely go from a leaf node to a leaf
    node.

    time: O(n) | space: O(logn)
    '''
    diameter = 0

    def traverse(root):
        nonlocal diameter
        if root is None:
            return 0

        left_path = right_path = 0
        if root.left:
            left_path = 1 + traverse(root.left)
        if root.right:
            right_path = 1 + traverse(root.right)

        diameter = max(left_path + right_path, diameter)
        return max(left_path, right_path)

    traverse(root)
    return diameter
