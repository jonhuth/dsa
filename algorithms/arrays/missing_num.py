def missing_num(nums):
    '''
    Given an array nums containing n distinct numbers in the range [0, n], 
    return the only number in the range that is missing from the array.

    Follow up: Could you implement a solution using only O(1) extra space
    complexity and O(n) runtime complexity?
    O(n) time | O(n) space
            seen = set()
            for x in nums:
                seen.add(x)

            for i in range(0, len(nums) + 1):
                if i not in seen:
                    return i

    O(n) time | O(1) space - reuse nums arr
    '''
    expected_sum = ((len(nums) + 1) * len(nums)) // 2
    present_sum = sum(nums)
    return expected_sum - present_sum
