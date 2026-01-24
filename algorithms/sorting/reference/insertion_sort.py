def insertion_sort(nums):
    # O(n^2) time | O(1) space
    # best case: input arr in sorted order and does n - 1 compares
    # insertion sort excels with partial sorts compared to other n^2 sorts
    n = len(nums)

    for i in range(1, n):
        j = i
        while j > 0 and nums[j-1] > nums[j]:
            nums[j-1], nums[j] = nums[j], nums[j-1]
            j -= 1
    return nums


nums1 = [2, 8, 5, 3, 9, 4]
nums2 = [1, 8, 22, 31, -1, 55, 26, 101, 1031]
print(insertion_sort(nums1))
print(insertion_sort(nums2))
