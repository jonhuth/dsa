def romanToInt(s: str) -> int:
    # time: O(1) | space: O(1) - val(s) in [1, 3999]
    lookup = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    i = num = 0
    while i < len(s):
        if i == len(s) - 1:  # if on last character
            num += lookup[s[i]]
            break
        currSym, nextSym = s[i], s[i+1]
        currVal, nextVal = lookup[currSym], lookup[nextSym]
        if nextVal > currVal:
            num += (nextVal - currVal)
            i += 2
        else:
            num += currVal
            i += 1
    return num
