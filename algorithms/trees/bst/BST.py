class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        # avg: O(logn) worst: O(n) T | avg and worst: O(1) S
        # worst case time complexity due to case where tree degenerates to linked list
        curr = self
        while True:
            if value < curr.value:
                if curr.left is None:
                    curr.left = BST(value)
                    break
                else:
                    curr = curr.left
            else:
                if curr.right is None:
                    curr.right = BST(value)
                    break
                else:
                    curr = curr.right
        return self

    def contains(self, value):
        # avg: O(logn) worst: O(n) T | avg and worst: O(1) S
        curr = self
        while curr is not None:
            if value < curr.value:
                curr = curr.left
            elif value > curr.value:
                curr = curr.right
            else:
                return True
        return False

    def remove(self, value, parent=None):
        # avg: O(logn) worst: O(n) T | avg and worst: O(1) S
        curr = self
        while curr is not None:
            if value < curr.value:
                parent, curr = curr, curr.left
            elif value > curr.value:
                parent, curr = curr, curr.right
            else:
                if curr.left is not None and curr.right is not None:
                    curr.value = curr.right.get_min_val()
                    curr.right.remove(curr.value, curr) # curr = curr.right, parent = curr
                elif parent is None:
                    if curr.left is not None:
                        curr.value = curr.left.value
                        curr.right = curr.left.right
                        curr.left = curr.left.left
                    elif curr.right is not None:
                        curr.value = curr.right.value
                        curr.left = curr.right.left
                        curr.right = curr.right.right
                    else:
                        pass
                elif parent.left == curr:
                    parent.left = curr.left if curr.left is not None else curr.right
                elif parent.right == curr:
                    parent.right = curr.left if curr.left is not None else curr.right
                break
        return self

    def get_min_val(self):
        # avg: O(logn) worst: O(n) T | avg and worst: O(1) S
        curr = self
        while curr.left is not None:
            curr = curr.left
        return curr.value
