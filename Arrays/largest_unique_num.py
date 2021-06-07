def largest_unique_num(A: list[int]) -> int:
    '''
    given array of nums, return the largest unique num in the array.
    counter based soln: time: O(n) | O(n)
    time: O(nlogn) | space: O(1)
    '''
    A.sort()
    A.append('dummy')

    for i in range(len(A) - 2, -1, -1):
        if A[i-1] != A[i] and A[i+1] != A[i]:
            return A[i]

    return -1


arr1 = [1, 2, 2, 3, 4, 4]
print(largest_unique_num(arr1))
