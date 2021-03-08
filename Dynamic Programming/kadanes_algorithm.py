def kadanesAlgorithm(array):
    # O(n) T | O(1) S where n is the length of the input array
    greatest_cum_sum = float('-inf')
    curr_cum_sum = 0
    for i in range(len(array)):
        curr_cum_sum = max(array[i], curr_cum_sum + array[i])
        greatest_cum_sum = max(greatest_cum_sum, curr_cum_sum)

    return greatest_cum_sum
