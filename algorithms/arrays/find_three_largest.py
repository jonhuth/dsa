def find_three_largest(array):
    '''
    Given arr of >= 3 ints, return a sorted arr of the 3 largest ints.
    sorting of input arr is not allowed.
    duplicate ints are allowed.

    time: O(n) | space: O(1)
    '''
    largest3 = [float('-inf')] * 3
    for ele in array:
        if ele > largest3[0]:
            if ele > largest3[1]:
                if ele > largest3[2]:
                    largest3[2], largest3[1], largest3[0] = ele, largest3[2], largest3[1]
                else:
                    largest3[1], largest3[0] = ele, largest3[1]
            else:
                largest3[0] = ele
    return largest3
