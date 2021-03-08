def largestRange(array):
    # time: O(n) | space: O(n) where n is the num of elements in array
    h = {ele: False for ele in array}
    longestStart, longestEnd = array[0], array[0]
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
        if r - l > longestEnd - longestStart:
            longestStart, longestEnd = l, r
    return [longestStart, longestEnd]
