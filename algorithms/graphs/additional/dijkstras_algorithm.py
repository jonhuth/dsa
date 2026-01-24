from heapq import heappush, heappop


def dijkstra(g: list[dict], s: int, e: int) -> tuple[list]:
    '''
    problem statement: given weighted digraph, use dijkstra's algorithm to find
    the lowest cost path from s to e. return a tuple of prev list and dist list.

    assume starting node is always 0 but can really be any node

    g = [{to0: weight, ton-1: weight}]
    g[u] = {v: w(u, v), z: w(u, z)}

    prev = node that got to each node
    prev[u] = v 
    dist = distance tracker for each node from the starting node.


    time: O(e*log(v)) | O(v + e)
    '''
    visited = [False for _ in g]
    prev = [None for _ in g]
    dist = [0] + [float('inf') for _ in range(len(g))]
    pq = []
    heappush(pq, (s, 0))  # (node, dist to node i from s)

    while pq:
        idx, min_val = heappop(pq)
        visited[idx] = True

        if dist[idx] < min_val:  # optimization
            continue

        edges = g[idx]
        for edge in edges:
            if visited[edge['to']]:
                continue
            new_dist = dist[idx] + edge['cost']
            if new_dist < dist[edge['to']]:
                prev[edge['to']] = idx
                dist[edge['to']] = new_dist
                # add to pq to potentially visit
                heappush(pq, (edge['to'], new_dist))

        if idx == e:
            # return dist[e]
            return (prev, dist)

    return (prev, dist)


def find_lowest_cost_path(g: list[dict], s: int, e: int) -> list:
    '''
    using dijkstra's algorithm, find the lowest cost path from s to e in the
    weighted digraph g.
    '''
    dist, prev = dijkstra(g, s, e)
    path = []
    # early return if no path
    if dist[e] == float('inf'):
        return path

    # find path from e to s then return
    curr = e
    while curr:
        path.append(curr)
        curr = prev[curr]
    return path.reverse()
