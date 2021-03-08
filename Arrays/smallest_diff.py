def smallestDifference(arrayOne, arrayTwo):
    # time: O(nlogn + mlogm) | space: O(1)
    arrayOne.sort()
    arrayTwo.sort()
    # minDiff = 2 (absolute diff)
    # arr[i] < arr[j] => i += 1
    # else j += 1
    # -1, 3, 5, 10, 20, 28
    #                   i
    # 15, 17, 26, 134, 135
    #              j
    i, j = 0, 0
    minDiffPair = []
    minDiff = float('inf')
    while i < len(arrayOne) and j < len(arrayTwo):
        currDiff = abs(arrayOne[i] - arrayTwo[j])
        if currDiff < minDiff:
            minDiffPair = [arrayOne[i], arrayTwo[j]]
            minDiff = currDiff
        if arrayOne[i] < arrayTwo[j]:
            i += 1
        else:
            j += 1

    return minDiffPair
