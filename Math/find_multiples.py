def find_multiples(cutoff: int, m1: int, m2: int) -> int:
    '''
    from project euler
    
    find sum of all multiples of m1 or m2 below cutoff
    '''
    ans = 0
    for num in range(cutoff):
        ans += num if num % m1 == 0 or num % m2 == 0 else 0
    return ans


print(find_multiples(1000, 3, 5))