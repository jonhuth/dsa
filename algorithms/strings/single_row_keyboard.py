def calculateTime(keyboard, word):
    # time: O(n) | space: O(1) where n is num of chars in word
    total = 0
    leftIdx = 0
    for char in word:
        rightIdx = keyboard.find(char)  # O(1) - 26 ltr keyboard
        offset = abs(leftIdx - rightIdx)
        total += offset
        leftIdx = rightIdx
    return total
