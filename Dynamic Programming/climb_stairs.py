def climb_stairs(n: int) -> int:
    memo = {1: 1, 2: 2}  # i: num ways to reach i steps

    def recurse(i):
        if i in memo:
            return memo[i]
        memo[i] = recurse(i-1) + recurse(i-2)
        return memo[i]
    return recurse(n)


print(climb_stairs(22))
