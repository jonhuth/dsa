def fib_memoize(n, memo={1: 1, 2: 1}):
    ''' 
    return the nth fibonacci number

    time: O(n) | space: O(n)
    '''
    if n in memo:
        return memo[n]
    memo[n] = fib_memoize(n - 1, memo) + fib_memoize(n - 2, memo)
    return memo[n]
