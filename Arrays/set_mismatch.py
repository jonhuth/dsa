def find_error_nums(nums):
    '''
    given set of integers originally containing all nums from 1 to n, find the
    num that was duplicated and the one that went missing.
    time: O(n) | space: O(1)
    '''
    dup, missing = -1, 1

    for x in nums:  # determine duplicate
        if nums[abs(x) - 1] < 0:  # if negative => we've seen already
            dup = abs(x)
        else:
            nums[abs(x) - 1] *= -1  # not dupe => make negative

    for i in range(1, len(nums)):  # determine missing
        if nums[i] > 0:
            missing = i + 1

    return [dup, missing]
    # time: O(n) | space: O(n)
    # s = set()
    # duplicate = None
    # for x in nums:
    #     if x in s:
    #         duplicate = x
    #     s.add(x)
    # missing = None
    # for i in range(1, len(nums) + 1):
    #     if i not in s: # missing value
    #         missing = i
    #         return [duplicate, missing]
