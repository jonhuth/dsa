def partition(arr, low, high):
    '''
    i starts at low + 1 (idx 1 typically), j starts at high (last idx of arr)
    time: O(n) | space: O(1)
    '''
    i, j = low + 1, high
    while True:
        while arr[i] <= arr[low]:
            if i == high:
                break
            i += 1
        while arr[j] >= arr[low]:
            if j == low:
                break
            j -= 1

        if i >= j:
            break
        arr[i], arr[j] = arr[j], arr[i]

    arr[low], arr[j] = arr[j], arr[low]
    # now pivot in place and elements <= are to left and elements >= are to right
    return j  # return idx of pivot


arr1 = [6, 7, 6, 5, 4, 8]
partition(arr1, 0, len(arr1)-1)
print(arr1)
