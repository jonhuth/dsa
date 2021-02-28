def gameOfLife(board):
    """
    According to Wikipedia's article: 
    "The Game of Life, also known simply as Life, is a cellular automaton
    devised by the British mathematician John Horton Conway in 1970."
    Do not return anything, modify board in-place instead.
    0 = dead
    1 = alive
    2 = dead -> alive
    3 = alive -> dead
    """
    def inBounds(i, j, matrix):
        return i >= 0 and i < len(matrix) and j >= 0 and j < len(matrix[0])

    def checkNeighbors(i, j, matrix):
        liveNeighbors = 0
        for k in range(-1, 2):
            for p in range(-1, 2):
                if not inBounds(i + k, j + p, matrix) or (k == 0 and p == 0):
                    continue
                if matrix[i + k][j + p] in [1, 3]:
                    liveNeighbors += 1

        return liveNeighbors

    for i in range(len(board)):
        for j in range(len(board[0])):
            neighbors = checkNeighbors(i, j, board)
            if board[i][j] in [1, 3] and neighbors < 2:
                board[i][j] = 3
            elif board[i][j] in [1, 3] and neighbors in [2, 3]:
                continue
            elif board[i][j] in [1, 3] and neighbors > 3:
                board[i][j] = 3
            elif board[i][j] in [0, 2] and neighbors == 3:
                board[i][j] = 2

    for i in range(len(board)):
        for j in range(len(board[0])):
            if board[i][j] == 2:
                board[i][j] = 1
            elif board[i][j] == 3:
                board[i][j] = 0
