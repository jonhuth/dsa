import doctest


def climb_stairs(n: int) -> int:
    '''
    problem statement: you need to get to the top of a n step staircase.
    each move up you can either take 1 or 2 steps. how many distinct ways
    are there to climb to the top?

    tests:
    >>> climb_stairs(2)
    2
    >>> climb_stairs(3)
    3
    >>> climb_stairs(22)
    28657

    solution:
    memoized variation of fibonacci sequence
    step_i = ith fib num

    complexity analysis:
    time: O(n) | space: O(n)
    where n is the num of steps
    '''
    memo = {1: 1, 2: 2}  # i: num ways to reach i steps

    def recurse(i):
        if i in memo:
            return memo[i]
        memo[i] = recurse(i-1) + recurse(i-2)
        return memo[i]
    return recurse(n)


doctest.testmod()
