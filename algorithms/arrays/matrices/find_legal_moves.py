def find_legal_moves(m: list[list[int]], pos: tuple) -> list[tuple]:
    '''
    given board and player position, return the next valid moves for the player.

    game rules.
    1. board filled with 0s (open space) and -1s (walls)
    2. can only move to 0s
    3. player can move left, right, up & down
    '''
    moves = []

    r, c = pos
    # if r - 1 >= 0 and m[r - 1][c] == 0:
    #     moves.append((r - 1, c))
    # if r + 1 < len(m) and m[r + 1][c] == 0:
    #     moves.append((r + 1, c))
    # if c - 1 >= 0 and m[r][c - 1] == 0:
    #     moves.append((r, c - 1))
    # if c + 1 < len(m[0]) and m[r][c + 1] == 0:
    #     moves.append((r, c + 1))
    for r_offset in range(-1, 2):
        for c_offset in range(-1, 2):
            if abs(r_offset) != abs(c_offset):
                new_r, new_c = r + r_offset, c + c_offset
                if 0 <= new_r < len(m) and 0 <= new_c < len(m) and m[new_r][new_c] == 0:
                    moves.append((new_r, new_c))

    return moves


board1 = [
    [0, 0, 0, 0, -1],
    [0, -1, -1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, -1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]
print(find_legal_moves(board1, (2, 2)))
print(find_legal_moves(board1, (0, 0)))
