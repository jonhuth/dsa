class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def tree_height(root: TreeNode) -> int:
    '''
    return the height of the tree which is the number of edges to the lowest
    leaf node.

    time: O(n) | space: O(logn)
    '''
    if root is None:
        return -1

    return max(tree_height(root.left), tree_height(root.right)) + 1
