def subarraySort(array):
    # time: O(n) | space: O(1)
    minThusFar = float('inf')
    leftIdx = -1
    for i in range(len(array) - 1, -1, -1):
        if array[i] < minThusFar:
            minThusFar = array[i]
        elif array[i] > minThusFar:
            leftIdx = i

    maxThusFar = float('-inf')
    rightIdx = -1
    for i in range(len(array)):
        if array[i] > maxThusFar:
            maxThusFar = array[i]
        elif array[i] < maxThusFar:
            rightIdx = i

    return [leftIdx, rightIdx]
