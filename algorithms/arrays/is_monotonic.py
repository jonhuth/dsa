def is_monotonic(array):
    '''
    given arr of ints, return whether input arr is monotonic.
    monotonic = nums are in non-decreasing order from left to right
    (monotonically increasing)
    or nums are in non-increasing order from left to right (monotonically
    decreasing)
    base cases: empty or 1 ele arrays are monotonic by default.

    time: O(n) | space: O(1)
    '''
    monotonic_incr = monotonic_decr = True
    for i in range(len(array) - 1):
        if array[i + 1] < array[i]:  # check if non-decreasing broke
            monotonic_incr = False

        if array[i + 1] > array[i]:  # check if non-increasing broke
            monotonic_decr = False

    return monotonic_incr or monotonic_decr
