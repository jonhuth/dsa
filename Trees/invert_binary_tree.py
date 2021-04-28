from collections import deque


def invert_binary_tree(root):
    '''
    prompt:
    given the root of a binary tree, invert the tree, and return its root.

    solution:
    traverse tree dfs style and swap left and right subtrees while backtracking up.
    swapping is done postorder; after left and right subtrees have been explored.

    time: O(n) | space: O(logn) - for recursion call stack
    '''
    if root is None:
        return None

    invert_binary_tree(root.left)
    invert_binary_tree(root.right)
    root.left, root.right = root.right, root.left
    return root


def invert_binary_tree(root):
    '''
    level order traversal implementation
    time: O(n) | space: O(w)
    n = num nodes, w = max width in tree
    '''
    if root is None:
        return

    q = deque([root])
    while q:
        curr = q.popleft()
        curr.left, curr.right = curr.right, curr.left
        if curr.left:
            q.append(curr.left)
        if curr.right:
            q.append(curr.right)

    return root


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
