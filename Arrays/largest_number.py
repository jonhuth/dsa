class LargerNumKey(str):
    def __lt__(x, y):
        return x+y > y+x


def largestNumber(nums):
    # given array of nums, order them in a way
    # that makes the largest num when all concatenated
    # let n = number of nums
    # time: O(nlogn) | space: O(1)

    nums.sort(key=LargerNumKey)
    for i, num in enumerate(nums):  # reuse nums array to save space
        nums[i] = str(num)

    return '0' if nums[0] == '0' else ''.join(nums)
