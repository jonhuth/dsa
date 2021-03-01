def setBit(num, i):
    # remember: bitwise or to set i-th bit, bitwise and to get i-th bit
    if i < 0:
        return num
    bitMask = 1 << i
    return num | bitMask
