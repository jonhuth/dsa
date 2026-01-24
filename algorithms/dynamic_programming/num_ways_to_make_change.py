# time: O(n*d) | space: O(n) - n = target amount & d = num denoms
def numberOfWaysToMakeChange(n, denoms):
    ways = [0 for amt in range(n+1)]
    ways[0] = 1

    for denom in denoms:  # loop through denominations of bills
        for amt in range(1, n+1):  # loop through 1,...n, ignore 0
            if denom <= amt:
                ways[amt] += ways[amt - denom]

    return ways[-1]
