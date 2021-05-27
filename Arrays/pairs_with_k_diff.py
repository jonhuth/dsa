def pairs_with_k_diff(arr, k):
    '''
    given an arr of distinct ints and non-negative int k, write a function that
    returns an arr of all pairs [x,y] in arr, st x - y = k. If no such pairs
    exsits return an empty array.
    note: the order of the pairs in the output array should maintain the order
    of the y element in the original arr.

    soln 1: check every arr[i], arr[j] pair where i != j using arr[j] - arr[i]
    == k => if so append ([arr[i], arr[j]])
    time: O(n^2) | space: O(1) - excluding space from output arr

    soln 2: keep hash set of all ints (they are already unique)
    loop through arr (for y in arr) check if y + k in hash set
    if so, append ([x,y]) to out
    '''
    out = []
    complements = set(arr)
    for y in arr:
        x = y + k
        if x in complements:
            out.append([x, y])

    return out
