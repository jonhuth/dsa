# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None


def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    '''
    given a binary tree, find the lowest common ancestor of the nodes p and q.

    time: O(n) | space: O(n)
    '''
    ans = root

    def recurse(node):
        nonlocal ans
        if not node:
            return False
        left = recurse(node.left)
        right = recurse(node.right)
        mid = node == p or node == q  # if root of subtree is either p or q
        if mid + left + right >= 2:
            ans = node
        return mid or left or right

    recurse(root)
    return ans
