# Definition for a binary tree node.
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def averageOfLevels(root):
    '''
    bfs style soln.
    1. init avgs arr & queue (starts with root at front)
    2. while queue not empty, init lvlSum and lvlCount both to 0
    3. make new empty temporary queue
    4. while queue not empty, popleft curr node
    5. lvlSum += curr.val and lvlCount += 1
    6. if curr node as left child append it to temporary q
    7. if curr nod has right child append to temporary q
    8. once original q empty, reassign q to temp q
    9. append the lvl avg to output array
    10. repeat until original q is empty then return output arr

    time: O(n) | space: O(w) where n = num nodes and m is max width of tree
    '''
    avgs = []
    q = deque([root])
    while q:
        lvlSum, lvlCount = 0, 0
        children = deque([])
        while q:
            curr = q.popleft()
            lvlSum += curr.val
            lvlCount += 1
            if curr.left:
                children.append(curr.left)
            if curr.right:
                children.append(curr.right)
        q = children
        avgs.append(lvlSum / lvlCount)
    return avgs
