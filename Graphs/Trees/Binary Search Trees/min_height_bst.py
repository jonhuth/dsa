# time: O(nlogn) | space: O(n)

def minHeightBst(array):
    def minHeightBstHelper(array, l, r, tree):
        mid = (l + r) // 2
        if l <= r:
            if tree is None:
                tree = BST(array[mid])

            else:
                tree.insert(array[mid])
            minHeightBstHelper(array, l, mid - 1, tree)
            minHeightBstHelper(array, mid + 1, r, tree)
        return tree

    return minHeightBstHelper(array, 0, len(array) - 1, None)


class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        if value < self.value:
            if self.left is None:
                self.left = BST(value)
            else:
                self.left.insert(value)
        else:
            if self.right is None:
                self.right = BST(value)
            else:
                self.right.insert(value)
