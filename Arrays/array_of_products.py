def array_of_products(arr):
    '''
    ex 1: arr = [8, 10, 2] => [20, 16, 80]
    left: [1, 8, 80] left to right
    right: [20, 2, 1] right to left
    out: [20, 16, 80]

    ex 2: arr = [0, 2, 5] => [10, 0, 0]
    left: [1, 0, 0] left to right
    right: [10, 5, 1] right to left
    out: [10, 0, 0]

    This is the key:
    -> left_arr[i] * right_arr[i] for all i
    time: O(n) | space: O(n)
    '''
    out = [1] * len(arr)
    left_prod = 1
    for i in range(1, len(arr)):
        left_prod *= arr[i-1]
        out[i] *= left_prod
    right_prod = 1
    for i in range(len(arr)-2, -1, -1):
        right_prod *= arr[i+1]
        out[i] *= right_prod

    return out


print(array_of_products([8, 10, 2]))
