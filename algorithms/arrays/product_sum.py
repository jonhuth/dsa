def product_sum(array, depth=1):
    '''
    given special array, return its product sum.
    special array = non-empty array that contains ints or other 'special'
    arrays.
    product sum of special array is the sum of its elements multiplied by their
    level of depth (how far nested)
    time: O(n) | space(d)
    where n is num of integers & d is worst nesting depth
    '''
    array_sum = 0
    for i in range(len(array)):
        if isinstance(array[i], int):
            array_sum += array[i]
        else:
            array_sum += product_sum(array[i], depth + 1)
    return depth * array_sum
