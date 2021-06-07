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
