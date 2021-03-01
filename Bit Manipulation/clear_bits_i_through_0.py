def clearBitsIthrough0(num, i):
    # clear bits i through 0 inclusive for num
    bitMask = (-1 << (i + 1))
    return num & bitMask
