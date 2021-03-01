def getBit(num, idx):
    # get the bit at the i-th idx
    bitMask = 1 << idx
    return num & bitMask
