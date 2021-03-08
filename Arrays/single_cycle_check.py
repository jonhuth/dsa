def hasSingleCycle(array):
	# O(n) T | O(1) S
    num_elements_visited, idx = 0, 0
    while num_elements_visited < len(array):
        if num_elements_visited > 0 and idx == 0:
            return False
        num_elements_visited += 1
        idx = (idx + array[idx]) % len(array)

    return idx == 0
