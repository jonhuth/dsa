def index_equals_value_search(arr):
    '''
    given arr of distinct ints in sorted order, return lowest idx i s.t. arr[i] == i else -1

    ex #1 
    arr = [-8,0,2,5]
            0 1 2 3
    mid = 1 => arr[midIdx] < midIdx
    mid = 2 => arr[midIdx] == midIdx => return True

    time: O(logn) | space: O(1)
    '''

    low, high = 0, len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == mid:
            return mid
        elif arr[mid] < mid:  # we need to move opposite direction
            low = mid + 1
        else:
            high = mid - 1

    return -1


arr = [-8, 0, 2, 5]
print(index_equals_value_search(arr))
