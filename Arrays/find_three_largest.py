def findThreeLargestNumbers(array):
    # time: O(n) | space: O(1)
    # [float('-inf'), float('-inf'), float('-inf')]
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
