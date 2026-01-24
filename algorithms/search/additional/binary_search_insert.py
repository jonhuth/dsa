def search_insert(nums: list[int], target: int) -> int:
    '''
    given a sorted array of distinct ints & a target val, return the idx if the
    target is found. else, return the idx where it would be if it were inserted
    in order

    if not found:
        left pointer > right pointer => return left
        left pointer < right pointer => return right

    time: O(logn) | space: O(1)
    '''
    l, r = 0, len(nums) - 1

    while l <= r:
        m = (l + r)//2
        if nums[m] == target:
            return m
        elif target > nums[m]:
            l = m + 1
        else:  # target < nums[m]
            r = m - 1
    if l > r:
        return l
    elif l < r:
        return r
    return m
