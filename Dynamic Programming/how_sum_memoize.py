def howSumMemoize(targetSum, nums, memo={}):
    # python gotcha: mutable default arg is created when the fn. is defined, not on successive calls
    # the mutable object is kept for successive fn. calls when no arg is passed
    # memo of form k: v => targetSum: nums that sum to targetSum
    # T => targetSum can be made by summing any number of ea num
    # time: O(n*t) | space: O(t)
    # where n = num of nums and t = targetSum size
    if targetSum in memo:
        return memo[targetSum]
    if targetSum == 0:
        return []
    if targetSum < 0:
        return None

    for num in nums:
        if howSumMemoize(targetSum - num, nums, memo) is not None:
            memo[targetSum] = memo.get(targetSum - num, []) + [num]
            return memo[targetSum]

    memo[targetSum] = None
    return None
