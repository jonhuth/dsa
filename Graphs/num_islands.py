def num_islands(grid: list[list[str]]) -> int:
    '''
    Given an mxn 2d binary grid which represents a map of '1's (land) and '0's
    (water), return the num of islands.

    island def: an island is surrounded by water and is formed by connecting
    adjacent lands horizontally or vertically. You may assume all four edges of
    the grid are all surrounded by water.

    time: O(m*n) | space: O(m*n) (call stack for recursive calls)
    '''
    if not grid:
        return 0
    count = 0

    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j, grid)

    return count


def dfs(i, j, grid):
    if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
        return
    grid[i][j] = '-1'
    dfs(i - 1, j, grid)  # look up
    dfs(i + 1, j, grid)  # look down
    dfs(i, j - 1, grid)  # look left
    dfs(i, j + 1, grid)  # look right


grid1 = [
    ["1", "1", "1", "1", "0"],
    ["1", "1", "0", "1", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "0"]
]

print(num_islands(grid1))

grid2 = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"]
]

print(num_islands(grid2))
