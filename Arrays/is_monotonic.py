def isMonotonic(array):
    # time: O(n) | space: O(1)
    monotonic_incr = monotonic_decr = True
    for i in range(len(array) - 1):
        if array[i + 1] < array[i]:  # check if non-decreasing broke
            monotonic_incr = False

        if array[i + 1] > array[i]:  # check if non-increasing broke
            monotonic_decr = False

    return monotonic_incr or monotonic_decr
