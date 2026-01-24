def riverSizes(matrix):
    sizes = []  # initialize sizes array (to be returned)
    visited = [[False for val in row]
               for row in matrix]  # initialize visited boolean matrix
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if not visited[i][j]:
                traverseNode(i, j, matrix, visited, sizes)
    return sizes


def traverseNode(i, j, matrix, visited, sizes):
    size = 0  # we are potentially at no river, set default size var
    toVisit = [[i, j]]  # stack of nodes to explroe, dfs method
    while toVisit:
        curr = toVisit.pop()
        i, j = curr[0], curr[1]
        if visited[i][j]:
            continue
        visited[i][j] = True
        if matrix[i][j] == 0:
            continue
        size += 1
        unvisited = getUnvisitedNeighbors(i, j, matrix, visited)
        toVisit += unvisited  # concat or append w/ existing stack
    if size > 0:
        sizes.append(size)


def getUnvisitedNeighbors(i, j, matrix, visited):
    unvisited = []  # as long as we are in bounds and haven't visited that neighor yet, add it to stack
    if i > 0 and not visited[i-1][j]:
        unvisited.append([i-1, j])
    if i < len(matrix) - 1 and not visited[i+1][j]:
        unvisited.append([i+1, j])
    if j > 0 and not visited[i][j-1]:
        unvisited.append([i, j-1])
    if j < len(matrix[0]) - 1 and not visited[i][j+1]:
        unvisited.append([i, j+1])
    return unvisited
