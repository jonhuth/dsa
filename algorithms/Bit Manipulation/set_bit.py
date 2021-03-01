def set_bit(idx, binaryNum):
    # remember: bitwise or to set i-th bit, bitwise and to get i-th bit
    bit_mask = 1 << idx
    return binaryNum | bit_mask
