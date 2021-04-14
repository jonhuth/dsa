def product(nums, i=0):
    '''
    return the product of an array of integers using recursion

    >>> product([1,2,3])
    6
    '''
    if i == len(nums):
        return 1
    return nums[i] * product(nums, i + 1)


if __name__ == '__main__':
    import doctest
    if doctest.testmod().failed == 0:
        print("\n*** ALL TESTS PASSED; YOU FOUND SUCCESS! ***\n")
