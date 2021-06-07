def is_toeplitz(arr: list[list[int]]) -> bool:
    """
    given a matrix of integers, return whether matrix is toeplitz or not.
    toeplitz matrix = matrix where each. left to right diagonal in the matrix
    has the same int.

    ex:
    1, 2, 3, 4
    5, 1, 2, 3
    6, 5, 1, 2
     => True

    notes: 
    for each (i,j) check arr[i][j] == arr[i+1][j+1] while inbounds

    time: O(m*n) | space: O(1)
    """
    for i in range(len(arr)):
        for j in range(len(arr[0])):
            if i+1 < len(arr) and j+1 < len(arr[0]):
                if arr[i][j] != arr[i+1][j+1]:
                    return False

    return True
