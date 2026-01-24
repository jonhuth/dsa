import merge


def mergeSortBU(arr):
    '''
    time: O(nlogn) | space: O(n)
    '''
    # n = len(arr)
    # aux = [0]
    # sz = 1
    # while sz < n:
    #     lo = 0
    #     while lo < n-sz:
    #         merge(arr, )
    #         lo += 2*sz

    #     sz *= 2


arr1 = [1, 2, 0, 4, 9, 3]
mergeSortBU(arr1)
print(arr1)
arr2 = [1, 2, 0, 4, 9, 3, 7]
mergeSortBU(arr2)
print(arr2)
