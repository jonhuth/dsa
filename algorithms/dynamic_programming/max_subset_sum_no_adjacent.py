# time: O(n) | space: O(1)
def maxSubsetSumNoAdjacent(array):
    if len(array) == 0:
        return 0
    elif len(array) == 1:
        return array[0]
    elif len(array) == 2:
        return max(array[0], array[1])

    lastLastMaxSum = array[0]
    lastMaxSum = max(array[0], array[1])

    for i in range(2, len(array)):
        # go with last sum and skip adding this current int, or add curr int to maxSum 2 spots back
        maxSum = max(lastMaxSum, lastLastMaxSum+array[i])
        lastMaxSum, lastLastMaxSum = maxSum, lastMaxSum

    return lastMaxSum
