def has_single_cycle(array):
    '''
    given array of ints representing index jumps, return whether the array contains
    a single cycle or not.
    single cycle = starting at any idx and following jumps, every element in the
    arr is visited exactly once before landing back on the starting index

    ex: [1, 2, 3, -6]

    O(n) T | O(1) S
    '''
    num_elements_visited, idx = 0, 0
    while num_elements_visited < len(array):
        if num_elements_visited > 0 and idx == 0:
            return False
        num_elements_visited += 1
        idx = (idx + array[idx]) % len(array)

    return idx == 0


print(has_single_cycle([1, 2, 3, 0]))
print(has_single_cycle([1, 2, 3, -6]))
