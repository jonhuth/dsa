from collections import deque
# Definition for a binary tree node.


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def zigzagLevelOrder(root):
    '''
    prompt: given root of binary tree, return zigzag level 
    order traversal of its nodes' values 
    (left to right, right to left, ...)

    algorithm: dfs based method

    time: O(n) | space: O(logn) - given balanced tree otherwise O(n)
    => same space complexity as bfs method if tree unbalanced
    '''
    if not root:
        return []
    levels = []

    def dfs(node, level=0):
        if level >= len(levels):
            levels.append(deque([node.val]))
        else:
            if level % 2 == 0:  # append on the right (left to right)
                levels[level].append(node.val)
            else:
                levels[level].appendleft(node.val)  # right to left

        for next_node in [node.left, node.right]:
            if next_node:
                dfs(next_node, level+1)

    dfs(root)
    return levels

# def zigzagLevelOrder(self, root: TreeNode) -> List[List[int]]:
#     '''
#     prompt: given root of binary tree, return zigzag level
#     order traversal of its nodes' values
#     (left to right, right to left, ...)

#     algorithm: bfs with inner queue to track given level

#     time: O(n) | space: O(n)
#     '''
#     if not root:
#         return []
#     levels = [[root.val]]
#     q = deque([root])
#     ltr = True
#     while q:
#         children = deque([])
#         while q:
#             curr = q.popleft()
#             if curr.left:
#                 children.append(curr.left)
#             if curr.right:
#                 children.append(curr.right)

#         if len(children) == 0:
#             continue

#         level = [node.val for node in children]
#         if ltr:
#             level = [node.val for node in reversed(children)]

#         levels.append(level)
#         q = children
#         ltr = not ltr # flip direction
#     return levels
