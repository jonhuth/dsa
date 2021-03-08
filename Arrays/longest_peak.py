def longestPeak(array):
    # O(n) T | O(1) S
    # find peaks
    # find lengths of peaks
    # if there is a peak, it must be >= len 3
    # update longest peak if greater than curr > longest thusfar
    longest_peak_len = 0
    i = 1
    while i < len(array) - 1:

        is_peak = array[i-1] < array[i] > array[i+1]
        if not is_peak:
            i += 1
            continue
        left_idx = i - 2
        while left_idx >= 0 and array[left_idx] < array[left_idx+1]:
            left_idx -= 1
        right_idx = i + 2
        while right_idx <= len(array) - 1 and array[right_idx] < array[right_idx-1]:
            right_idx += 1

        curr_peak_len = right_idx - left_idx - 1
        longest_peak_len = max(longest_peak_len, curr_peak_len)
        i = right_idx

    return longest_peak_len
