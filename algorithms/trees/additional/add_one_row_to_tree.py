# Definition for a binary tree node.
from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def addOneRow(root: TreeNode, val: int, depth: int) -> TreeNode:
    '''
    algorithm:
    1. base case: if depth == 1 create new root and old root attaches to leftSubtree
    using bfs & double queue soln.
    2. init depth to 1 and q with root
    3. while depth < input depth
        a. init temp queue and get all child nodes for current level
        b. rebind queue to temp queue (since it became empty) and increment curr depth
        c. repeat
    now we have all nodes on depth - 1 level in queue
    4. for node in q:
        a. set left and right subtrees to new nodes with given val
        b. old left and right subtrees are now children of newleft and right
    5. return the tree at the root


    worst case time & space: O(n) | O(w) 
    where n=num nodes, w=most nodes on any depth (max size of queue)
    '''
    if depth == 1:
        newRoot = TreeNode(val=val)
        newRoot.left = root
        return newRoot

    d = 1
    q = deque([root])
    while d < depth - 1:  # getting to correct depth and getting list of correct nodes who's children will change
        tempQ = deque([])
        while q:
            node = q.popleft()
            if node.left:
                tempQ.append(node.left)
            if node.right:
                tempQ.append(node.right)
        q = tempQ  # after inner while loop breaks, temp holds nodes on current level
        d += 1

    while q:
        node = q.popleft()
        leftSubtree, rightSubtree = node.left, node.right
        newLeft, newRight = TreeNode(val=val, left=leftSubtree), TreeNode(
            val=val, right=rightSubtree)
        node.left, node.right = newLeft, newRight

    return root
