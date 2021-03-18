# This is an input class. Do not edit.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# worst case time: O(n) where n is the # of nodes in the tree
# worst case space: O(d) where d is the depth or height of the tree


def validateBst(tree, minVal=float('-inf'), maxVal=float('inf')):
    # base case: we either hit node out of min and max bounds first or we hit empty node
    if tree is None:
        return True
    if tree.value < minVal or tree.value >= maxVal:
        return False

    # check
    leftIsValid = validateBst(tree.left, minVal, tree.value)
    rightIsValid = validateBst(tree.right, tree.value, maxVal)
    return leftIsValid and rightIsValid
