def bubble_sort(nums):
    # O(n^2) time | O(1) space
    n = len(nums)

    for i in range(n - 1):
        flag = False
        for j in range(n - i - 1):
            if nums[j] > nums[j+1]:
                flag = True
                nums[j], nums[j+1] = nums[j+1], nums[j]
        if not flag:  # if no swaps were made on current sweep, array is sorted
            break
    return nums


nums1 = [2, 8, 5, 3, 9, 4]
nums2 = [1, 8, 22, 31, -1, 55, 26, 101, 1031]
print(bubble_sort(nums1))
print(bubble_sort(nums2))
