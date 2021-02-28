def canThreePartsEqualSum(arr):
    # time: O(n) | space: O(1)
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
