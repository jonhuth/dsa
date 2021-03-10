def findNumOfValidWords(words, puzzles):
    wordMaskFreqs = {}
    for word in words:
        mask = getMask(word)
        wordMaskFreqs[mask] = wordMaskFreqs.get(mask, 0) + 1

    answer = [0] * len(puzzles)

    for i, puzzle in enumerate(puzzles):
        mask = getMask(puzzle)
        subMask = mask

        total = 0
        firstBitIndex = ord(puzzle[0]) - ord('a')  # index of 1st ltr in puzzle

        while True:
            if subMask == 0:
                break

            if subMask >> firstBitIndex & 1:
                total += wordMaskFreqs.get(subMask, 0)

            subMask = (subMask - 1) & mask

        answer[i] = total

    return answer


def getMask(word):
    mask = 0

    for char in word:
        idx = ord(char) - ord('a')
        mask |= 1 << idx
    return mask
