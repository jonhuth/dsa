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
