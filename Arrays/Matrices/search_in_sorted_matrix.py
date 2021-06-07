def search_in_sorted_matrix(matrix, target):
    '''
    You're given a 2d array (matrix) of distinct integers and a target integer.
    Each row in the matrix is sorted, and each column is also sorted; the matrix
    doesn't necessarily have the same height and width. 

    Write a function that returns an array of the row and column indices of the
    target integer if it's contained in the matrix, otherwise [-1, -1].

    time: O(m + n) | space: O(1)
    '''
    i, j = 0, len(matrix[0]) - 1
    while i < len(matrix) and j > -1:
        if matrix[i][j] > target:
            j -= 1
        elif matrix[i][j] < target:
            i += 1
        else:
            return [i, j]
    return [-1, -1]
