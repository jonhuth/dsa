class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def findClosestValueInBst(tree, target):
    # iterative soln. - time: O(logn) | space: O(1)
    # recursive soln. - time : O(logn) | space: O(logn)
    currNode = tree
    closestVal = currNode.value if currNode else None
    smallestDiff = abs(closestVal - target)

    while currNode is not None:
        currDiff = abs(currNode.value - target)
        if currDiff < smallestDiff:
            smallestDiff = currDiff
            closestVal = currNode.value

        if target < currNode.value:
            currNode = currNode.left
        elif target > currNode.value:
            currNode = currNode.right
        else:
            return currNode.value

    return closestVal
