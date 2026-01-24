from collections import deque


# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def rightSideView(root):
    '''
    Given the root of a binary tree,
    imagine yourself standing on the right side of it,
    return the values of the nodes
    you can see ordered from top to bottom.

    algorithm:
    use bfs to traverse tree and keep track of
    right most node vals at ea level

    time: O(n) | space: O(n)
    '''
    if not root:
        return []
    right_most = [root.val]
    q = deque([(root, 0)])
    prev_depth = 0
    while q:
        curr_node, curr_depth = q.popleft()
        if curr_depth > prev_depth:  # new level
            right_most.append(curr_node.val)
        if curr_node.right:
            q.append((curr_node.right, curr_depth + 1))
        if curr_node.left:
            q.append((curr_node.left, curr_depth + 1))
        prev_depth = curr_depth

    return right_most


# def rightSideView(root):
#     '''
#     algorithm: recursive dfs method

#     time: O(n) | space: O(n)
#     '''
#     if root is None:
#         return []
#     right_most = []

#     def recurse(root, d=0):
#         if d == len(right_most):
#             right_most.append(root.val)
#         if root.right:
#             recurse(root.right, d + 1)
#         if root.left:
#             recurse(root.left, d + 1)

#     recurse(root)
#     return right_most
