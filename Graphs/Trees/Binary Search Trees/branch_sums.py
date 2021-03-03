# This is the class of the input root. Do not edit it.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def branchSums(root):
    # time: O(n) | space: O(n) where n is the number of nodes
    sums = []
    branchSumsHelper(root, 0, sums)
    return sums


def branchSumsHelper(node, current_sum, sums):
    if node is None:
        return

    new_sum = current_sum + node.value
    if node.left is None and node.right is None:
        # leaf node
        sums.append(new_sum)
        return
    branchSumsHelper(node.left, new_sum, sums)
    branchSumsHelper(node.right, new_sum, sums)
