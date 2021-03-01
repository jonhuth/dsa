def cycleInGraph(edges):
    # time: O(v + e) space: O(v)
    visited, inStack = [False] * len(edges), [False] * len(edges)

    for node in range(len(edges)):
        if visited[node]:
            continue

        if isNodeInCycle(edges, node, visited, inStack):
            return True

    return False


def isNodeInCycle(edges, node, visited, inStack):
    visited[node], inStack[node] = True, True

    neighbors = edges[node]
    for neighbor in neighbors:
        if not visited[neighbor]:
            if isNodeInCycle(edges, neighbor, visited, inStack):
                return True
        elif inStack[neighbor]:
            return True

    inStack[node] = False
    return False
