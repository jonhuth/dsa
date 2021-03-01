def selection_sort(nums):
    # O(n^2) time | O(1) space
    n = len(nums)
    for i in range(n-1):
        min_idx = i  # min num thus far in unsorted partition
        for j in range(i + 1, n):  # loop through every num after
            if nums[j] < nums[min_idx]:
                min_idx = j
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    return nums

# def selection_sort(nums): # maybe not stable??
#     # O(n^2) time | O(1) space
#     n = len(nums)
#     for i in range(n-1):
#         for j in range(i + 1, n):
#             if nums[j] < nums[i]:
#                 nums[j], nums[i] = nums[i], nums[j]
#     return nums


nums1 = [2, 8, 5, 3, 9, 4]
nums2 = [1, 8, 22, 31, -1, 55, 26, 101, 1031]
print(selection_sort(nums1))
print(selection_sort(nums2))
