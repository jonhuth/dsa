def knapsack_problem(items: list[list], capacity: int):
    '''
    given items each with a value and cost, find the combination
    of items that maximizes the total value while staying <= the bag's capacity.
    return the total value.

    item: (value, cost)

    m*n matrix - where each row represents value of taking item i
    each col represents constraint size, increments by 1 [1:n]

    time: O(m*n) | space: O(m*n)
    where m = num items, n = constraint size
    '''
    dp = [[0 for _ in range(capacity + 1)] for _ in range(len(items) + 1)]

    for i in range(1, len(dp)):
        value, cost = items[i-1]
        if cost > capacity:
            continue
        for j in range(len(dp[0])):
            if cost <= j:
                dp[i][j] = max(dp[i-1][j], value + dp[i-1][j-cost])
            else:
                dp[i][j] = dp[i-1][j]

    return [dp[-1][-1], get_knapsack_items(dp, items)]


def get_knapsack_items(dp: list[list], items: list[list]):
    sequence = []
    i, j = len(dp) - 1, len(dp[0]) - 1
    while i > 0:
        if dp[i][j] != dp[i-1][j]:
            sequence.append(i - 1)
            j -= items[i-1][1]
        i -= 1
        if j == 0:
            break

    return list(reversed(sequence))


items1 = [[1, 2], [4, 3], [5, 6], [6, 7]]
cap1 = 10
print(knapsack_problem(items1, cap1))
