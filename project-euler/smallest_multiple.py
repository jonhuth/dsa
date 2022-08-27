def smallest_multiple():
    '''
    notes
    - it has to be an even num
    '''
    for num in range(2520**2, 10**9, 2):
        print(num)
        if all([num % i == 0 for i in range(10, 21)]):
            return num
    return -1

print(smallest_multiple())