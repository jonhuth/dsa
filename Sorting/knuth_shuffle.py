from random import randint


def knuth_shuffle(arr):
    '''
    linear time, inplace shuffle
    shuffling is kind of like the opposite of sorting

    algorithm:
    1. loop through arr and at each index, generate random index in [0, i]
    2. swap arr[i] and arr[rand_idx]
    3. return arr

    time: O(n) | space: O(1)
    '''
    for i in range(len(arr)):
        r = randint(0, i)
        arr[i], arr[r] = arr[r], arr[i]

    return arr
