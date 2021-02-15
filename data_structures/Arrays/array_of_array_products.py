def array_of_array_products(arr):
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

    if len(arr) <= 1:
        return []

    left_arr = [1] + [0] * (len(arr) - 1)  # [1, 0, 0, ...] len=n
    right_arr = [0] * (len(arr) - 1) + [1]  # [0, 0, ... , 1] len = n

    for i in range(1, len(arr)):
        left_arr[i] = arr[i-1] * left_arr[i-1]

    for i in range(len(arr)-2, -1, -1):
        right_arr[i] = arr[i+1] * right_arr[i+1]

    return [left_arr[i] * right_arr[i] for i in range(len(arr))]
