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


def binarySearchIterative(array, target):
    # time: O(logn) | space: O(1)
    l, r = 0, len(array) - 1
    m = (l + r) // 2

    while l <= r:
        if target > array[m]:
            # target in the right half
            l = m + 1
            m = (l + r) // 2

        elif target < array[m]:
            # target in the left half
            r = m - 1
            m = (l + r) // 2

        else:
            return m

    return -1
