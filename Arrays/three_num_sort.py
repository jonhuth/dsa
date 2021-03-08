def threeNumberSort(array, order):
    # time: O(n) | space: O(1)
    counts = [0, 0, 0]
    for num in array:
        orderIdx = order.index(num)
        counts[orderIdx] += 1
    idx = 0
    for i in range(3):
        while counts[i] > 0 and idx < len(array):
            array[idx] = order[i]
            idx += 1
            counts[i] -= 1
    return array
