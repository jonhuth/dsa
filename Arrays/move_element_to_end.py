def move_elements_to_end(array, to_move):
    '''
    given arr of ints and int to move, move all ints == int to move to end of array.
    time: O(n) space: O(1)
    '''
    l, r = 0, len(array) - 1

    while l <= r:
        if array[r] == to_move:
            r -= 1
        elif array[l] != to_move:
            l += 1
        elif array[l] == to_move and array[r] != to_move:
            array[l], array[r] = array[r], array[l]  # swap

    return array
