def clearBitsMSBthroughI(num, i):
    # clear bits MSB through i (inclusive of i)
    bitMask = (1 << i) - 1
    return num & bitMask