def setBit(num, idx):
    # remember: bitwise or to set i-th bit, bitwise and to get i-th bit
    bitMask = 1 << idx
    return num | bitMask
