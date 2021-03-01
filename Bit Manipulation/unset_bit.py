def unsetBit(num, i):
    # set i-th bit in num to 0
    # i >= 0
    # insight: result = num - 2^i if i-th bit was on, otherwise no change
    if i < 0:
        return num
    bitMask = ~(1 << i)
    return num & bitMask
