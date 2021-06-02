
def min_height_bst(array):
    '''
    given a sorted (increasing order) array with unique integer elements, write
    an algorithm to create a binary search tree with minimal height.

    algorithm: divide and conquer inserting middle val into BST while recursing
    through the array.

    time: O(nlogn) | space: O(n)
    '''
    def min_height_bst(array, l, r, tree):
        mid = (l + r) // 2
        if l <= r:
            if tree is None:
                tree = BST(array[mid])

            else:
                tree.insert(array[mid])
            min_height_bst(array, l, mid - 1, tree)
            min_height_bst(array, mid + 1, r, tree)
        return tree

    return min_height_bst(array, 0, len(array) - 1, None)


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
