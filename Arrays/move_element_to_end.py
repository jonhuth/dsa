def moveElementToEnd(array, toMove):
    # time: O(n) space: O(1)
    l = 0
    r = len(array) - 1

    while l <= r:
        if array[l] == toMove and array[r] == toMove:
            r -= 1  # move right pointer more left
        elif array[l] != toMove and array[r] == toMove:
            l += 1  # move left pointer more right
        elif array[l] != toMove and array[r] != toMove:
            l += 1
        elif array[l] == toMove and array[r] != toMove:
            array[l], array[r] = array[r], array[l]  # swap

    return array
