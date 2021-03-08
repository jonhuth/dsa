def threeNumberSum(array, targetSum):
	# time: O(n^2) | space: O(n)
    triplets = []
    array.sort()
    for i in range(len(array) - 2):
        l, r = i+1, len(array) - 1
        while l < r:
            currentSum = array[i] + array[l] + array[r]
            if currentSum < targetSum:
                l += 1
            elif currentSum > targetSum:
                r -= 1
            else:
                triplets.append([array[i], array[l], array[r]])
                l += 1
                r -= 1
    return triplets
