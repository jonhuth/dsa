def isToeplitz(arr):
    """
          @param arr: int[][]
          @return: bool
          """
    # for each (i,j) check arr[i][j] == arr[i+1][j+1] while inbounds
    # time: O(m*n) | space: O(1)
    for i in range(len(arr)):
        for j in range(len(arr[0])):
            if i+1 < len(arr) and j+1 < len(arr[0]):
                if arr[i][j] != arr[i+1][j+1]:
                    return False

    return True
