def binarySearchRecursive(array, target):
    # time: O(logn) | space: O(logn)
    l, r = 0, len(array) - 1

    def binarySearchHelper(array, target, l, r):
        m = (l + r) // 2
        if l > r:
            # pointer went too far, target not here
            return -1
        if target == array[m]:
            return m

        elif target > array[m]:
            # target in the right half
            return binarySearchHelper(array, target, m + 1, r)

        # target in the left half
        return binarySearchHelper(array, target, l, m - 1)

    return binarySearchHelper(array, target, l, r)
