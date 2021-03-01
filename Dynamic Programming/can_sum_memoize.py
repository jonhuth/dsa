def canSumMemoize(targetSum, nums, memo={0: True}):
    # memo of form k: v => targetSum: T or F
    # T => targetSum can be made by summing any number of ea num
    # time: O(n*t) | space: O(t)
    # where n = num of nums and t = targetSum size
    if targetSum in memo:
        return memo[targetSum]
    if targetSum == 0:
        return True
    if targetSum < 0:
        return False

    for num in nums:
        if canSumMemoize(targetSum - num, nums, memo):
            memo[targetSum] = True
            return True

    memo[targetSum] = False
    return False
