def searchInSortedMatrix(matrix, target):  # time: O(m + n) | space: O(1)
    i, j = 0, len(matrix[0]) - 1
    while i < len(matrix) and j > -1:
        if matrix[i][j] > target:
            j -= 1
        elif matrix[i][j] < target:
            i += 1
        else:
            return [i, j]
    return [-1, -1]
