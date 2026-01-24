# def merge(left, right):
#     # time: O(m + n) | space: O(m + n)
#     merged = []
#     i, j = 0, 0
#     while i < len(left) and j < len(right):
#         if left[i] < right[j]:
#             merged.append(left[i])
#             i += 1
#         else:
#             merged.append(right[i])
#             j += 1
#     while i < len(left):
#         merged.append(left[i])
#         i += 1
#     while j < len(right):
#         merged.append(right[j])
#         j += 1

#     return merged


def merge(arr, left, right, i=0, j=0, k=0):
    '''
    merge subroutine - uses input array to save space instead of copying
    time: O(m + n) | space: O(1)
    just O(n) time and space assuming len(left) = n and len(right) = n
    '''
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            arr[k] = left[i]
            i += 1
        else:
            arr[k] = right[j]
            j += 1
        k += 1

    while i < len(left):
        arr[k] = left[i]
        i += 1
        k += 1

    while j < len(right):
        arr[k] = right[j]
        j += 1
        k += 1
