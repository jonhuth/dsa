def shuffle_by_sort(arr):
    '''
    move entries more than one position at a time
    by h-sorting the array.
    like insertion sort but skip by h when looking backwards
    time: O(n^3/2) | space: O(1)
    '''
    n = len(arr)
    h = 1
    # increment sequence: 3x + 1 => log3(n) increment values
    while h < n // 3:
        h = 3 * h + 1

    while h >= 1:
        for i in range(h, n):
            j = i
            while j >= h and (arr[j-h] > arr[j]):
                arr[j-h], arr[j] = arr[j], arr[j-h]
                j -= h

        h = h // 3

    return arr
