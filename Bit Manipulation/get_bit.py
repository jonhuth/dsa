def getBit(num, idx):
    # get the bit at the i-th idx
    # num (shift_left, shift_right) how many idxs over
    bitMask = 1 << idx
    return (num & bitMask) != 0
