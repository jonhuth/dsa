def isValidSubsequence(array, sequence):
    # time: O(n) space: O(1) where n is the length of the array
    idx = 0

    for i in range(len(array)):
        if idx == len(sequence):
            return True
        if array[i] == sequence[idx]:
            idx += 1

    return idx == len(sequence)
