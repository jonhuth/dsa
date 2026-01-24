def sort_k_messed_array(arr, k):
    '''
    ex1: arr = [1, 4, 5, 2, 3, 7, 8, 6, 10, 9], k = 2
     i
    [1, 2, 3,4, 5, 6, 7, 8 ,9 ,10]
     j   
    notes:
    - assume k small relative to n (like constant)
    - uses variant of selection sort


     soln. steps:
     1. iterate through arr
     2. at ea. element while i + offset is in bounds and offset <= k:
      swap arr[i], arr[i+k] if swap made, break inner loop

      time complexity: O(n) | space complexity: O(1)
    '''
    if k == 0:
        return arr

    for i in range(len(arr)):
        offset = 1
        min_idx = i
        while i + offset < len(arr) and offset <= k:
            if arr[i] > arr[i + offset]:
                min_idx = i + offset
            offset += 1
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

    return arr


arr = [1, 4, 5, 2, 3, 7, 8, 6, 10, 9]
k = 2
print(sort_k_messed_array(arr, k))
