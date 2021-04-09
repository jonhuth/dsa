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
        merge(arr, left, right)


def merge(temp, arr1, arr2, p1=0, p2=0, k=0):
    '''
    merge subroutine
    time: O(m + n) | space: O(m + n)
    just O(n) time and space assuming len(arr1) = n and len(arr2) = n
    '''
    while p1 < len(arr1) and p2 < len(arr2):
        if arr1[p1] < arr2[p2]:
            temp[k] = arr1[p1]
            p1 += 1
        else:
            temp[k] = arr2[p2]
            p2 += 1
        k += 1

    while p1 < len(arr1):
        temp[k] = arr1[p1]
        p1 += 1
        k += 1

    while p2 < len(arr2):
        temp[k] = arr2[p2]
        p2 += 1
        k += 1


arr1 = [1, 2, 0, 4, 9, 3]
mergeSort(arr1)
print(arr1)
arr2 = [1, 2, 0, 4, 9, 3, 7]
mergeSort(arr2)
print(arr2)
