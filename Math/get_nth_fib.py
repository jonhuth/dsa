def getNthFib(n):

    # argument: 1,2...n
    # worst case: O(n) time | O(1) space
    # last two fib nums stored here
    fibs = [0, 1]  # last two fibs (i-2, i-1)
    for i in range(2, n):
        fibs[0], fibs[1] = fibs[1], fibs[0] + fibs[1]
    return fibs[n] if n in [0, 1] else fibs[0] + fibs[1]
