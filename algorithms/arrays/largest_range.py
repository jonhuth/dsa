def largest_range(array):
    '''
    given array of ints, return arr of length 2 representing largest range of
    ints contained in arr. [starting_num, ending_num]

    ex: arr = [1, 11, 3, 0, 15, 5, 2, 4, 10, 7, 12, 6] => [0, 7]
    time: O(n) | space: O(n) where n is the num of elements in array
    '''
    h = {ele: False for ele in array}
    longest_start, longest_end = array[0], array[0]
    for ele in array:
        if not h[ele]:
            h[ele] = True
            l, r = ele - 1, ele + 1
            while l in h:
                h[l] = True
                l -= 1
            l += 1
            while r in h:
                h[r] = True
                r += 1
            r -= 1
        if r - l > longest_end - longest_start:
            longest_start, longest_end = l, r
    return [longest_start, longest_end]
