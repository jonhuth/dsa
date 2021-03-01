def dutch_national_flag(nums):
    '''
    given arr of 0s, 1s, 2s representing red, white & blue respectively, return arr in sorted order
    low = right bound of 0s (everything to left is correctly all 0s)
    mid = curr element
    high = left bound of 2s (everything to right is correctly all 2s)
    3 cases:
    1. arr[mid] < 1 => 0 swap arr[mid], arr[low] low++ mid++
    2. arr[mid] == 1 => 1 mid++
    3. arr[mid] > 1 => 2 swap arr[mid], arr[high] high--

    ex: [0,1,2,1,2,1,1,0,0] => [0,0,0,1,1,1,1,2,2]
    [0,0,0,1,1,1,1,2,2]
           l
                 m
                 h
    time: O(n) | space: O(1)
    '''
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] < 1:
            nums[mid], nums[low] = nums[low], nums[mid]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

    return nums
