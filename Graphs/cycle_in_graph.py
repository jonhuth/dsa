def cycleInGraph(edges):
    '''
    problem statement: given array of edges, return True if there is a cycle in
    the graph, otherwise false

    edges = [[a,b,c], ... , [x, y, z]] -> represents digraph.
    each idx in edges array represents a node, and nested list
    represents neighboring nodes for node i (edge between node i and node x) for
    all nodes in edges[i].

    notes:
    1. we must check every node due to possibility of disconnected graph
    2.

    algorithm:
    1. keep track of visited nodes and a separate stack for the nodes currently in
    the recursive call stack.
    2. go through each node in edges and if the node hasn't been visited before and
    if it is in a cycle return True.
       a. cycle definition: if neighboring node is currently in the stack there
       is a cycle
    3. otherwise return False if we don't find any cycle for all nodes.


    time: O(v + e) space: O(v)
    time is O(v + e) due to visiting each node once like depth first search (dfs)
    '''

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
