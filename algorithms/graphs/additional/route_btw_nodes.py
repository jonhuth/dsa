from collections import deque


def routes_btw_nodes(g: list[list[int]], s: int, e: int) -> bool:
    '''
    given digraph and starting and ending nodes, return whether there is a path
    from s to e.

    time: O(v + e) | space: O(e)
    '''
    if s >= len(g) or e >= len(g):
        return False
    visited = set()
    q = deque([s])

    while q:
        curr = q.popleft()
        visited.add(curr)
        if curr == e:
            return True
        for neighbor in g[curr]:
            if neighbor not in visited:
                q.append(neighbor)
    return False


g1 = [[1, 2, 3], [2], [3, 0], []]
print(routes_btw_nodes(g1, 0, 4))
print(routes_btw_nodes(g1, 1, 3))
print(routes_btw_nodes(g1, 2, 0))
