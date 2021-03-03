def productSum(array, depth=1):
    # time: O(n) | space(d)
    # where n is num of integers & d is worst nesting depth
    array_sum = 0
    for i in range(len(array)):
        if isinstance(array[i], int):
            array_sum += array[i]

        else:
            array_sum += productSum(array[i], depth + 1)
    return depth * array_sum
