def missingNumber(nums):
    # O(n) time | O(n) space
    #         seen = set()
    #         for x in nums:
    #             seen.add(x)

    #         for i in range(0, len(nums) + 1):
    #             if i not in seen:
    #                 return i

    # O(n) time | O(1) space - reuse nums arr
    presentSum = sum(nums)
    expectedSum = sum(list(range(0, len(nums) + 1)))
    return expectedSum - presentSum
