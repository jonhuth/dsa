def merge(temp, left, right, p1=0, p2=0, k=0):
    '''
    merge subroutine - uses input array to save space instead of copying
    time: O(m + n) | space: O(1)
    just O(n) time and space assuming len(left) = n and len(right) = n
    '''
    while p1 < len(left) and p2 < len(right):
        if left[p1] < right[p2]:
            temp[k] = left[p1]
            p1 += 1
        else:
            temp[k] = right[p2]
            p2 += 1
        k += 1

    while p1 < len(left):
        temp[k] = left[p1]
        p1 += 1
        k += 1

    while p2 < len(right):
        temp[k] = right[p2]
        p2 += 1
        k += 1
