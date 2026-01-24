def three_num_sum(array, target_sum):
    '''
    given a non-empty arr of unique ints, return all triplets that sum to target sum
    time: O(n^2) | space: O(n)
    '''
    triplets = []
    array.sort()
    for i in range(len(array) - 2):
        l, r = i + 1, len(array) - 1
        while l < r:
            currentSum = array[i] + array[l] + array[r]
            if currentSum < target_sum:
                l += 1
            elif currentSum > target_sum:
                r -= 1
            else:
                triplets.append([array[i], array[l], array[r]])
                l += 1
                r -= 1
    return triplets
