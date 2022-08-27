from math import ceil, sqrt

def is_prime_number(num: int) -> bool:
    '''a number is a prime number if its only factors are 1 and itself'''
    if num < 2:
        return False
    
    for x in range(2, ceil(sqrt(num) + 1)):
        if num % x == 0:
            return False
    return True


def largest_prime_factor(num: int) -> int:
    ans = 1
    for i in range(2, ceil(sqrt(num) + 1)):
        print(i)
        if num % i == 0 and is_prime_number(i):
            ans = i


    return ans

print(largest_prime_factor(600_851_475_143))