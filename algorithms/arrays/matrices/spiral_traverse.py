def spiral_traverse(array):
    '''
    Write a function that takes in an nxm 2d array and returns a 1d array of all
    the array's elelemnts in spiral order.

    Spiral order starts at the top left corner of the 2d array, goes to the
    right, and proceeds in a spiral pattern all the way until every element has
    been visited.

    O(m*n) T & S where m*n is the total number of elements in the 2d array
    '''
    out = []
    start_row, end_row = 0, len(array) - 1
    start_col, end_col = 0, len(array[0]) - 1

    while start_row <= end_row and start_col <= end_col:  # while in bounds
        for col in range(start_col, end_col + 1):
            out.append(array[start_row][col])

        for row in range(start_row + 1, end_row + 1):
            out.append(array[row][end_col])

        for col in range(end_col - 1, start_col - 1, -1):
            if start_row == end_row:
                break
            out.append(array[end_row][col])

        for row in range(end_row - 1, start_row, -1):
            if start_col == end_col:
                break
            out.append(array[row][start_col])

        start_row += 1
        end_row -= 1
        start_col += 1
        end_col -= 1

    return out
    # out = []
        
    #     i = j = 0
    #     iMin, iMax = 0, len(matrix) - 1
    #     jMin, jMax = 0, len(matrix[0]) - 1
        
    #     while len(out) < len(matrix)*len(matrix[0]):
    #         while j <= jMax and iMin <= i <= iMax: # go right
    #             out.append(matrix[i][j])
    #             j += 1
    #         j -= 1 # offset going one too far to the right
    #         iMin += 1 # no longer need to visit iMin row
    #         i = iMin # start on next row
            
    #         while i <= iMax and jMin <= j <= jMax: # go down
    #             out.append(matrix[i][j])
    #             i += 1
    #         i -= 1
    #         jMax -= 1
    #         j = jMax
            
    #         while j >= jMin and iMin <= i <= iMax: # go left
    #             out.append(matrix[i][j])
    #             j -= 1
    #         j += 1
    #         iMax -= 1
    #         i = iMax
            
    #         while i >= iMin and jMin <= j <= jMax: # go up
    #             out.append(matrix[i][j])
    #             i -= 1
    #         i += 1
    #         jMin += 1
    #         j = jMin

    #     return out
