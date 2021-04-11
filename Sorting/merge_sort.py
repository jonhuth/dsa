import merge


def mergeSort(arr):
    '''
    invented by John von neumann
    time: O(nlogn) | space: O(n)
    '''
    if len(arr) > 1:
        mid = len(arr)//2
        left, right = arr[:mid], arr[mid:]
        mergeSort(left)
        mergeSort(right)
        merge.merge(arr, left, right)


arr1 = [1, 2, 0, 4, 9, 3]
mergeSort(arr1)
print(arr1)
arr2 = [1, 2, 0, 4, 9, 3, 7]
mergeSort(arr2)
print(arr2)
