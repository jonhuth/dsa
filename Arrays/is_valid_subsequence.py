def is_valid_subsequence(array, sequence):
    '''
    given 2 non-empty arrays of integers, write a function that determines
    whether the 2nd array is a subsequence of the 1st.

    subsequence = elements in 2nd arr are in same order as 1st but not
    necessarily adjacent.

    time: O(n) space: O(1) where n is the length of the array
    '''
    idx = 0

    for i in range(len(array)):
        if idx == len(sequence):
            return True
        if array[i] == sequence[idx]:
            idx += 1

    return idx == len(sequence)
