def two_num_sum(array, target_sum):
    '''
    given a non-empty arr of unique ints, return both nums that sum to target
    sum. else return empty arr.
    time: O(n) | space: O(n)
    '''
    s = set()

    for e in array:
        complement = target_sum - e
        if complement in s:
            return [complement, e]  # found pair
        else:
            s.add(e)
    return []  # didn't find pair
