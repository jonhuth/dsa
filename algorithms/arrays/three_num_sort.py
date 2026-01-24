def three_num_sort(array, order):
    '''
    given arr made up of all 0s, 1s & 2s, sort the array in the following order:
    [0s, 1s, 2s]

    time: O(n) | space: O(1)
    '''
    counts = [0, 0, 0]
    for num in array:  # get count for each num
        order_idx = order.index(num)
        counts[order_idx] += 1
    idx = 0
    for i in range(3):  # fill in nums from left to right
        while counts[i] > 0 and idx < len(array):
            array[idx] = order[i]
            idx += 1
            counts[i] -= 1
    return array
