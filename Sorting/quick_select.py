from random import shuffle
import partition


def quick_select(arr, k):
    '''
    find kth largest num in arr

    use quick sort like implementation

    time: O(n) - avg time O(nlogn) - worst time | space: O(logn)
    '''
    shuffle(arr)
    low, high = 0, len(arr) - 1

    while low < high:
        j = partition.partition(arr, low, high)
        if j < k:  # look in right half
            low = j + 1
        elif j > k:  # look in left half
            high = j - 1
        else:
            return arr[k]  # kth smallest element

    return arr[k]
