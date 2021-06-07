def smallest_diff(arr1, arr2):
    '''
    given 2 arrays of nums, return the num from the pair: [arr[i], arr[j]] s.t.
    makes the min diff possible.
    time: O(nlogn + mlogm) | space: O(1)
    '''
    arr1.sort()
    arr2.sort()
    # minDiff = 2 (absolute diff)
    # arr[i] < arr[j] => i += 1
    # else j += 1
    # -1, 3, 5, 10, 20, 28
    #                   i
    # 15, 17, 26, 134, 135
    #              j
    i, j = 0, 0
    min_diff_pair = []
    min_diff = float('inf')
    while i < len(arr1) and j < len(arr2):
        curr_diff = abs(arr1[i] - arr2[j])
        if curr_diff < min_diff:
            min_diff_pair = [arr1[i], arr2[j]]
            min_diff = curr_diff
        if arr1[i] < arr2[j]:
            i += 1
        else:
            j += 1

    return min_diff_pair
