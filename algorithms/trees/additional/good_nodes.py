class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def goodNodes(root):
    def dfs(root, max_thus_far):
        nonlocal count
        if root.val >= max_thus_far:
            max_thus_far = root.val
            count += 1
        if root.left:
            dfs(root.left, max_thus_far)
        if root.right:
            dfs(root.right, max_thus_far)

    count = 0
    dfs(root, root.val)
    return count
