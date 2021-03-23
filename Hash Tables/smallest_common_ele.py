from collections import Counter


def smallestCommonElement(mat) -> int:
    '''
    prompt: given matrix where every row is in strictly increasing order, return the smallest common element among the rows. if none return -1.
    first approach - count nums from first row in other rows
    time: O(m*n) | space: O(n) where m = num rows, n = num cols in mat

    slower but more space efficient - binary search ea num in 1st row
    in every other row
    time: O(n*m*logn) | space: O(1)
    '''
    counter = Counter(mat[0])
    for i in range(1, len(mat)):  # loop through remaining rows and eles
        for j in range(len(mat[i])):
            if mat[i][j] in counter:
                counter[mat[i][j]] += 1

    for key in counter:
        if counter[key] == len(mat):
            return key
    return -1
