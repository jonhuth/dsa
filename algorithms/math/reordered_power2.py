from collections import Counter


def reorderedPowerOf2(N: int) -> bool:
    """
    prompt: given integer N, find if its possible to reorder digits in N to make a power of 2.
    leading digit cannot be 0.

    naive soln. - enumerate all permutations
    time: O(n*n!) | space O(n*n!) where n is num digits in N

    1. get all permutations of N
    2. throw out ones that have leading 0
    3. for each perm: check if power of 2 using: ((n & (n-1) == 0) and n != 0) => true
    4. otherwise return false at end

    optimal soln. - check set of digits for N against set of digits for all power of 2 nums
    time: O((logn)^2) | space: O(logn)
    note: if N is power of 10, cannot get power of 2, return false
    """
    N_counter = Counter(str(N))
    for i in range(30):
        power2_counter = Counter(str(1 << i))
        if N_counter == power2_counter:
            return True

    return False
