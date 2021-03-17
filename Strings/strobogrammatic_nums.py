def isStrobogrammatic(num: str) -> bool:
    # time: O(d) | space: O(1) where d is num of digits in num
    strobMapping = {'0': '0', '1': '1', '6': '9', '8': '8', '9': '6'}
    left, right = 0, len(num) - 1
    while left <= right:
        if num[left] not in strobMapping or num[right] not in strobMapping:
            return False
        if num[left] != strobMapping[num[right]]:
            return False
        left += 1
        right -= 1

    return True
