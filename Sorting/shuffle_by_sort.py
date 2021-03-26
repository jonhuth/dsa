from random import random


def shuffle_by_sort(arr):
    '''
    shuffling is kind of like the opposite of sorting
    input arr must contain unique elements
    algorithm:
    1. assign rand num uniformly in range [0, 1) to each ele in arr
    2. sort those random nums
    3. map each ele to its correct position using hash table : rand_num => num
    4. return arr

    shuffle sort produces a uniformly random permutation of the input array, 
    provided no duplicate values


    '''
    shuffle_keys = [(random(), num) for num in arr]
    shuffle_keys.sort(key=lambda x: x[0])

    for i in range(len(arr)):
        arr[i] = shuffle_keys[i][1]

    return arr
