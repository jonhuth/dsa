from random import shuffle
import partition


def quick_sort(arr):
    '''
    time: O(nlogn) | space: O(logn) - space for call stack
    '''
    shuffle(arr)  # shuffling needed for performance guarantee
    _sort(arr, 0, len(arr)-1)


def _sort(arr, low, high):
    if high <= low:
        return
    j = partition.partition(arr, low, high)
    _sort(arr, low, j-1)  # recursively sort left subarray
    _sort(arr, j+1, high)  # recursively sort right subarray


arr1 = [2, 7, -1, 13, 15, 55, 102, 37, 22, 21, 22]
quick_sort(arr1)
print(arr1)
