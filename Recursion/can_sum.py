def canSum(target, nums):
    # time: O(n^t) | space: O(t)
    # where n = num of nums and t = target size
    if target == 0:
        return True
    if target < 0:
        return False
    for num in nums:
        if canSum(target - num, nums):
            return True
    return False
