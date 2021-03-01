def toggleBit(num, i):
    # toggle the i-th bit
    if i < 0:
        return num
    bitMask = 1 << i
    return num ^ bitMask
