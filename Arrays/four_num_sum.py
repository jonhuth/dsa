def fourNumberSum(array, targetSum):
    # time : O(n^2) avg O(n^3) worst | space: O(n^2)
    allPairSums = {}
    quadruplets = []
    for i in range(1, len(array) - 1):
        for j in range(i+1, len(array)):
            currentSum = array[i] + array[j]
            diff = targetSum - currentSum
            if diff in allPairSums:
                for pair in allPairSums[diff]:
                    quadruplets.append(pair + [array[i], array[j]])
        for k in range(0, i):
            currentSum = array[i] + array[k]
            if currentSum not in allPairSums:
                allPairSums[currentSum] = [[array[k], array[i]]]
            else:
                allPairSums[currentSum].append([array[k], array[i]])
    return quadruplets
