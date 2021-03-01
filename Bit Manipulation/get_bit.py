def getBit(num, i):
    # get the bit at the i-th index
    # num (shift_left, shift_right) how_many_idxs_over
    if i < 0:
        return num
    bitMask = 1 << i
    return (num & bitMask) != 0
