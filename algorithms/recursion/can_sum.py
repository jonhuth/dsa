def canSum(targetSum, nums):
    # time: O(n^t) | space: O(t)
    # where n = num of nums and t = targetSum size
    if targetSum == 0:
        return True
    if targetSum < 0:
        return False
    for num in nums:
        if canSum(targetSum - num, nums):
            return True
    return False
