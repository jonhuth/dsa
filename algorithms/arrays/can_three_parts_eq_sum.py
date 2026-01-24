def can_three_parts_equal_sum(arr):
    '''
    Given an array of integers arr, return true if we can 
    partition the array into three non-empty parts with equal sums.

    Formally, we can partition the array if we can find indexes 
    i + 1 < j with 
    (arr[0] + arr[1] + ... + arr[i] == arr[i + 1] + arr[i + 2] + ... + 
    arr[j - 1] == arr[j] + arr[j + 1] + ... + arr[arr.length - 1])

    time: O(n) | space: O(1)
    '''
    totalSum = sum(arr)
    if totalSum % 3 != 0:
        return False
    targetSum = totalSum // 3

    cumulativeSum = counter = 0
    for num in arr:
        if counter == 2:
            return True

        cumulativeSum += num
        if cumulativeSum == targetSum:
            cumulativeSum = 0
            counter += 1
    return False
